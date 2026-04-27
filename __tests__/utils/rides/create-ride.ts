import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { CreateRideInputDTO } from '../../../src/rides/dto/create-ride.input-dto';
import { createDriver } from '../drivers/create-driver';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { getCreateRideInputDTO } from './get-create-ride-input-dto';
import { RideViewModel } from '../../../src/rides/models/ride.view-model';
import { SETTINGS } from '../../../src/core/settings/settings';

export const createRide = async (app: Express, rideDto?: CreateRideInputDTO): Promise<RideViewModel> => {
  const driver = await createDriver(app);
  const defaultRideData = getCreateRideInputDTO(driver.id);
  const testRideData = { ...defaultRideData, ...rideDto };

  const createdRideResponse = await request(app)
    .post(SETTINGS.RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createdRideResponse.body;
};
