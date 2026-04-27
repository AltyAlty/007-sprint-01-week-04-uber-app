import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversRepository } from '../../repositories/drivers.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { UpdateDriverInputDTO } from '../../dto/update-driver.input-dto';

/*Создаем функцию-обработчик "updateDriverHandler()" для PUT-запросов для изменения данных водителя по id при помощи
URI-параметров.*/
export const updateDriverHandler = async (
  req: Request<{ id: string }, {}, UpdateDriverInputDTO, {}>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    /*Просим репозиторий "driversRepository" найти водителя по ID в БД.*/
    const driver = driversRepository.findById(id);

    /*Если водитель не был найден, то сообщаем об этом клиенту.*/
    if (!driver) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Driver was not found' }]));
      return;
    }

    /*Если водитель был найден, то просим репозиторий "driversRepository" изменить данные водителя и сообщаем об этом
    клиенту.*/
    await driversRepository.update(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
