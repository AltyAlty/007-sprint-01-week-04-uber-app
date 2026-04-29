import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToWrappedDriverOutputDTO } from '../mappers/map-to-wrapped-driver-output-dto.util';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*"Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
параметра "res".

Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
"put()" внутри роутеров из Express:
1. На первом месте в типе идут URI-параметры.
2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса, то есть что будет возвращено.
3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
4. На четвертом месте в типе идут Query-параметры.

Функция-обработчик "getDriverByIdHandler()" для GET-запросов для поиска водителя по ID при помощи URI-параметров.*/
export async function getDriverByIdHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    /*Просим сервис "driversService" найти данные по водителю по ID.*/
    const driver = await driversService.findById(id);
    /*Преобразовываем данные по водителю из БД в подготовленные для отправки клиенту данные по водителю.*/
    const driverOutput = mapToWrappedDriverOutputDTO(driver);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
}
