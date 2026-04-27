import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { DriverViewModel } from '../../../src/drivers/models/driver.view-model';
import { SETTINGS } from '../../../src/core/settings/settings';

/*Создаем функцию "getDriverById()", получающую данные о водителе по ID и возвращающую их, для целей тестирования.*/
export const getDriverById = async (app: Express, driverId: string): Promise<DriverViewModel> => {
  /*Получаем данные о водителе.*/
  const driverResponse = await request(app)
    .get(`${SETTINGS.DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  /*Возвращаем тело ответа.*/
  return driverResponse.body;
};
