/*Тип для сообщения об ошибке валидации при использовании библиотеки express-validator.*/
export type ValidationErrorType = {
  field: string;
  message: string;
};
