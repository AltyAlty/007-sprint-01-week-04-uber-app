import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { RideViewModel } from '../../../src/rides/models/ride.view-model';
import { SETTINGS } from '../../../src/core/settings/settings';

export const getRideById = async (
  app: Express,
  rideId: string,
  expectedStatus?: HttpStatus,
): Promise<RideViewModel> => {
  const testStatus = expectedStatus ?? HttpStatus.Ok;

  const getResponse = await request(app)
    .get(`${SETTINGS.RIDES_PATH}/${rideId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(testStatus);

  return getResponse.body;
};
