import { Request, Response } from 'express';
import { Driver } from '../../types/driver';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';

/*"Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
параметра "res".

Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
"put()" внутри роутеров из Express:
1. На первом месте в типе идут URI-параметры.
2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса, то есть что будет возвращено.
3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
4. На четвертом месте в типе идут Query-параметры.

Создаем функцию-обработчик "getDriverByIdHandler()" для GET-запросов для поиска водителя по ID при помощи
URI-параметров.*/
export const getDriverByIdHandler = async (
  req: Request<{ id: string }, Driver, {}, {}>,
  res: Response<Driver | null | unknown>,
) => {
  try {
    const id = req.params.id;
    /*Просим репозиторий "driversRepository" найти водителя по ID в БД.*/
    const driver = await driversRepository.findById(id);

    /*Если водитель не был найден, то сообщаем об этом клиенту.*/
    if (!driver) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Driver was not found' }]));
      return;
    }

    /*Если водитель был найден, то сообщаем об этом клиенту.*/
    const driverViewModel = mapToDriverViewModel(driver);
    res.status(HttpStatus.Ok).send(driverViewModel);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
