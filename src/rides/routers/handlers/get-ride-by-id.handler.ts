import { Request, Response } from 'express';
import { mapToWrappedRideOutputDTO } from '../mappers/map-to-wrapped-ride-output-dto.util';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';

export async function getRideByIdHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const id = req.params.id;
    const ride = await ridesService.findById(id);
    const rideOutput = mapToWrappedRideOutputDTO(ride);
    res.status(HttpStatus.Ok).send(rideOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
}
