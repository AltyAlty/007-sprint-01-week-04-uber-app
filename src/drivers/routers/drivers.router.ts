import { Router } from 'express';
import { getDriverListHandler } from './handlers/get-driver-list.handler';
import { getDriverByIdHandler } from './handlers/get-driver-by-id.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { driverInputDtoValidation } from '../validation/driver.input-dto.validation-middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';

/*Создаем роутер из Express для работы с данными по водителям.*/
export const driversRouter = Router({});
/*Таким образом можно применить какой-то middleware ко всем маршрутам.*/
driversRouter.use(superAdminGuardMiddleware);

/*Конфигурируем роутер "driversRouter".*/
driversRouter
  /*GET-запрос для получения данных по всем водителям.*/
  .get('', getDriverListHandler)
  /*GET-запрос для поиска водителя по id при помощи URI-параметров. При помощи ":" Express позволяет указывать
  переменные в пути. Такие переменные доступны через объект "req.params".*/
  .get('/:id', idValidation, inputValidationResultMiddleware, getDriverByIdHandler)
  /*POST-запрос для добавления нового водителя.*/
  .post('', driverInputDtoValidation, inputValidationResultMiddleware, createDriverHandler)
  /*PUT-запрос для изменения данных водителя по id при помощи URI-параметров.*/
  .put('/:id', idValidation, driverInputDtoValidation, inputValidationResultMiddleware, updateDriverHandler)
  /*DELETE-запрос для удаления водителя по id при помощи URI-параметров.*/
  .delete('/:id', idValidation, inputValidationResultMiddleware, deleteDriverHandler);
