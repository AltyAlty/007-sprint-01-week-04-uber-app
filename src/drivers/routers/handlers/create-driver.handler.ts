import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToWrappedDriverOutputDTO } from '../mappers/map-to-wrapped-driver-output-dto.util';
import { CreateDriverDataInputDTO } from '../input-dto/create-driver-data.input-dto';

/*Функция-обработчик "createDriverHandler()" для POST-запросов для добавления нового водителя.*/
export async function createDriverHandler(req: Request<{}, {}, CreateDriverDataInputDTO>, res: Response) {
  try {
    /*Просим сервис "driversService" создать нового водителя.*/
    const createdDriverId = await driversService.create(req.body.data.attributes);
    /*Просим сервис "driversService" найти данные по созданному водителю по ID.*/
    const createdDriver = await driversService.findById(createdDriverId);
    /*Преобразовываем данные по водителю из БД в подготовленные для отправки клиенту данные по водителю.*/
    const driverOutput = mapToWrappedDriverOutputDTO(createdDriver);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Created).send(driverOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
}
