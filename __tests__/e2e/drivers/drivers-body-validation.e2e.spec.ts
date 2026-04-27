import 'dotenv/config';
import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { VehicleFeature } from '../../../src/drivers/types/driver';
import { CreateDriverInputDTO } from '../../../src/drivers/dto/create-driver.input-dto';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/auth/generate-admin-auth-token';
import { clearDb } from '../../utils/db/clear-db';
import { getCreateDriverInputDTO } from '../../utils/drivers/get-create-driver-input-dto';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';

describe('Drivers API body validation check', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();
  const correctTestDriverData: CreateDriverInputDTO = getCreateDriverInputDTO();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  afterAll(async () => await stopDb());

  /*Описываем тест, проверяющий отказ в добавлении водителя с непрошедшими валидацию данными.*/
  it('❌ should not create a driver when incorrect body passed; POST /api/drivers', async () => {
    await request(app).post(SETTINGS.DRIVERS_PATH).send(correctTestDriverData).expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '',
        vehicleModel: '',
        vehicleYear: 'year',
        vehicleLicensePlate: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);
    const driverListResponse = await request(app).get(SETTINGS.DRIVERS_PATH).set('Authorization', adminToken);
    expect(driverListResponse.body).toHaveLength(0);
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными.*/
  it('❌ should not update a driver when incorrect body passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    const invalidDataSet1 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: '   ',
        phoneNumber: '    ',
        email: 'invalid email',
        vehicleMake: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        phoneNumber: '',
        vehicleModel: '',
        vehicleYear: 'year',
        vehicleLicensePlate: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        name: 'A',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);
    const driverResponse = await getDriverById(app, createdDriver.id);
    expect(driverResponse).toEqual({ ...createdDriver });
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными о фичах машины.*/
  it('❌ should not update a driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverData);

    await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .send({
        ...correctTestDriverData,
        vehicleFeatures: [VehicleFeature.ChildSeat, 'invalid-feature', VehicleFeature.WiFi],
      })
      .expect(HttpStatus.BadRequest);

    const driverResponse = await getDriverById(app, createdDriver.id);
    expect(driverResponse).toEqual({ ...createdDriver });
  });
});
