import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';
import { Ride } from '../../types/ride';
import { ridesRepository } from '../../repositories/rides.repository';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export const getRideByIdHandler = async (
  req: Request<{ id: string }, Ride, {}, {}>,
  res: Response<Ride | null | unknown>,
) => {
  try {
    const id = req.params.id;
    const ride = await ridesRepository.findById(id);

    if (!ride) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Ride was not found' }]));
      return;
    }

    const rideViewModel = mapToRideViewModelUtil(ride);
    res.send(rideViewModel);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
