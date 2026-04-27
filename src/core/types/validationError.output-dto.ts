import { ValidationErrorType } from './validationErrorType';

/*DTO для объектов, содержащих массивы с сообщениями об ошибках валидации при использовании библиотеки
express-validator.*/
export type ValidationErrorOutputDTO = { errorMessages: ValidationErrorType[] };
