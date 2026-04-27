/*Импортируем функцию "validationResult()" из библиотеки express-validator для извлечения ошибок валидации из тела
запроса.*/
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from '../../types/validationErrorType';
import { ValidationErrorOutputDTO } from '../../types/validationError.output-dto';
import { HttpStatus } from '../../types/http-statuses';

/*Создаем функцию "createErrorMessages()" для формирования объектов, содержащих массивы с сообщениями об ошибках
валидации для случаев, когда библиотека express-validator не используется.*/
export const createErrorMessages = (errors: ValidationErrorType[]): ValidationErrorOutputDTO => ({
  errorMessages: errors,
});

/*Создаем функцию "formatErrors()" для формирования объектов, содержащих сообщения об ошибках валидации при
использовании библиотеки express-validator.*/
const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;
  return { field: expressError.path, message: expressError.msg };
};

/*Создаем middleware "inputValidationResultMiddleware" для формирования ответу клиенту об ошибках валидации.*/
export const inputValidationResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
  /*Если валидация при помощи библиотеки express-validator обнаруживает ошибки валидации, то информация об этих ошибках
  добавляется в тело запроса. Поэтому пытаемся здесь извлечь такие ошибки.*/
  const errors = validationResult(req)
    /*Форматируем ошибки валидации при помощи функции "formatErrors()".*/
    .formatWith(formatErrors)
    /*Возвращаем массив, в котором будет находиться только самые первые ошибка валидации для каждого поля.*/
    .array({ onlyFirstError: true });

  /*Если ошибки валидации были найдены, то сообщаем об этом клиенту.*/
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json({ errorMessages: errors });
    return;
  }

  /*Если ошибок валидации не было найдено, то передаем управление следующему обработчику.*/
  next();
};
