import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { rideInputDtoValidation } from '../validation/ride.input-dto.validation-middlewares';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRideListHandler } from './handlers/get-ride-list.handler';
import { getRideByIdHandler } from './handlers/get-ride-by-id.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';

export const ridesRouter = Router({});
ridesRouter.use(superAdminGuardMiddleware);

ridesRouter
  .get('', getRideListHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getRideByIdHandler)
  .post('', rideInputDtoValidation, inputValidationResultMiddleware, createRideHandler)
  .post('/:id/actions/finish', idValidation, inputValidationResultMiddleware, finishRideHandler);
