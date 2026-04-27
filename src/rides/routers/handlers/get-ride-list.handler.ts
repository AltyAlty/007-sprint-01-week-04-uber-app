import { Request, Response } from 'express';
import { ridesRepository } from '../../repositories/rides.repository';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToRideViewModelUtil } from '../mappers/map-to-ride-view-model.util';

export const getRideListHandler = async (req: Request, res: Response) => {
  try {
    const rides = await ridesRepository.findAll();
    const rideViewModels = rides.map(mapToRideViewModelUtil);
    res.send(rideViewModels);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
