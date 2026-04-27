import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesRepository } from '../../repositories/rides.repository';
import { createErrorMessages } from '../../../core/middlewares/validation/input-validation-result.middleware';

export const finishRideHandler = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id;
    const ride = await ridesRepository.findById(id);

    if (!ride) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{ field: 'id', message: 'Ride was not found' }]));
      return;
    }

    if (ride.finishedAt) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages([{ field: 'id', message: 'Ride was finished' }]));
      return;
    }

    await ridesRepository.finishRide(id, new Date());
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    console.log(error);
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
