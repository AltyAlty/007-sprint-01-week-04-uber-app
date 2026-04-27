/*Импортируем метод "param()" из библиотеки express-validator, чтобы проверять ID.*/
import { param } from 'express-validator';

/*Создаем middleware "idValidation", проверяющий, что ID:
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Является типа ObjectId.*/
export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isLength({ min: 1 })
  .withMessage('ID must not be empty')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');
