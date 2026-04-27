import { Request, Response } from 'express';
import { CreateDriverInputDTO } from '../../dto/create-driver.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { Driver } from '../../types/driver';
import { driversRepository } from '../../repositories/drivers.repository';
import { mapToDriverViewModel } from '../mappers/map-to-driver-view-model.util';

/*Создаем функцию-обработчик "createDriverHandler()" для POST-запросов для добавления нового водителя.*/
export const createDriverHandler = async (req: Request<{}, {}, CreateDriverInputDTO>, res: Response) => {
  try {
    /*Создаем объект с данными нового водителя.*/
    const newDriver: Driver = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      vehicle: {
        make: req.body.vehicleMake,
        model: req.body.vehicleModel,
        year: req.body.vehicleYear,
        licensePlate: req.body.vehicleLicensePlate,
        description: req.body.vehicleDescription,
        features: req.body.vehicleFeatures,
      },
      createdAt: new Date(),
    };

    /*Просим репозиторий "driversRepository" создать нового водителя в БД.*/
    const createdDriver = await driversRepository.create(newDriver);
    const driverViewModel = mapToDriverViewModel(createdDriver);
    /*Сообщаем об успешном добавлении нового водителя клиенту.*/
    res.status(HttpStatus.Created).send(driverViewModel);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
