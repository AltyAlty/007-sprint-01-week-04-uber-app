import { Request, Response } from 'express';
import { CreateRideInputDTO } from '../../dto/create-ride.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { Ride } from '../../types/ride';
import { driversRepository } from '../../../drivers/repositories/drivers.repository';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export const createRideHandler = async (req: Request<{}, {}, CreateRideInputDTO>, res: Response) => {
  try {
    const driverId = req.body.driverId;
    const driver = await driversRepository.findById(driverId);

    if (!driver) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages([{ field: 'id', message: 'Driver was not found' }]));
      return;
    }

    const activeRide = await ridesRepository.findActiveRideByDriverId(driverId);

    if (activeRide) {
      res
        .status(HttpStatus.BadRequest)
        .send(createErrorMessages([{ field: 'status', message: 'Driver is currently on a trip' }]));
      return;
    }

    const newRide: Ride = {
      clientName: req.body.clientName,
      driver: {
        id: req.body.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} ${driver.vehicle.model}`,
      },
      price: req.body.price,
      currency: req.body.currency,
      createdAt: new Date(),
      updatedAt: null,
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: req.body.fromAddress,
        to: req.body.toAddress,
      },
    };

    const createdRide = await ridesRepository.create(newRide);
    const rideViewModel = mapToRideViewModelUtil(createdRide);
    res.status(HttpStatus.Created).send(rideViewModel);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
