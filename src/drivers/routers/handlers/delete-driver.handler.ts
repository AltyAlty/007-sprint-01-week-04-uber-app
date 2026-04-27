import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { ridesRepository } from '../../../rides/repositories/rides.repository';

/*Создаем функцию-обработчик "deleteDriverHandler()" для DELETE-запросов для удаления водителя по ID при помощи
URI-параметров.*/
export const deleteDriverHandler = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
  try {
    const id = req.params.id;
    /*Просим репозиторий "driversRepository" найти водителя по ID в БД.*/
    const driver = await driversRepository.findById(id);

    /*Если водитель не был найден, то сообщаем об этом клиенту.*/
    if (!driver) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Driver was not found' }]));
      return;
    }

    /*Просим репозиторий "ridesRepository" узнать в БД не находится ли водитель в поездке в данный момент.*/
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);

    /*Если водитель находится в поездке в данный момент, то сообщаем об этом клиенту.*/
    if (activeRide) {
      res
        .status(HttpStatus.BadRequest)
        .send(createErrorMessages([{ field: 'status', message: 'Driver is currently on a trip' }]));
      return;
    }

    /*Если водитель не находится в поездке в данный момент, то просим репозиторий "driversRepository" удалить водителя
    по ID в БД и сообщаем об этом клиенту.*/
    await driversRepository.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
