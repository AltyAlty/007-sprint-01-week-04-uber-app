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
import { updateDriverById } from '../../utils/drivers/update-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { UpdateDriverInputDTO } from '../../../src/drivers/dto/update-driver.input-dto';

/*Описываем тестовый набор.*/
describe('Drivers API', () => {
  /*Создание экземпляра приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);
  /*Генерируем токен для Basic авторизации.*/
  const adminToken = generateBasicAuthToken();

  /*Перед запуском тестов, запускаем и очищаем БД с данными по водителям.*/
  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  /*После того как тесты отработают, отключаемся от БД с данными по водителям.*/
  afterAll(async () => await stopDb());

  /*Описываем тест, проверяющий добавление нового водителя в БД.*/
  it('✅ should create a driver; POST /api/drivers', async () => {
    const newDriver: CreateDriverInputDTO = {
      ...getCreateDriverInputDTO(),
      name: 'Feodor',
      email: 'feodor@example.com',
    };

    await createDriver(app, newDriver);
  });

  /*Описываем тест, проверяющий получение данных по всем водителями из БД.*/
  it('✅ should return a list of drivers; GET /api/drivers', async () => {
    await createDriver(app);
    await createDriver(app);

    const driverListResponse = await request(app)
      .get(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  /*Описываем тест, проверяющий получение данных по водителю по ID из БД.*/
  it('✅ should return a driver by ID; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const driver = await getDriverById(app, createdDriver.id);

    expect(driver).toEqual({
      ...createdDriver,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий изменение данных по водителю по ID в БД.*/
  it('✅ should update a driver by ID; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);

    const driverUpdateData: UpdateDriverInputDTO = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriverById(app, createdDriver.id, driverUpdateData);
    const driverResponse = await getDriverById(app, createdDriver.id);

    expect(driverResponse).toEqual({
      id: createdDriver.id,
      name: driverUpdateData.name,
      phoneNumber: driverUpdateData.phoneNumber,
      email: driverUpdateData.email,
      vehicle: {
        description: driverUpdateData.vehicleDescription,
        features: driverUpdateData.vehicleFeatures,
        licensePlate: driverUpdateData.vehicleLicensePlate,
        make: driverUpdateData.vehicleMake,
        model: driverUpdateData.vehicleModel,
        year: driverUpdateData.vehicleYear,
      },
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий удаление водителя по ID в БД.*/
  it('✅ should delete a driver by ID; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);

    await request(app)
      .delete(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${SETTINGS.DRIVERS_PATH}/${createdDriver.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
