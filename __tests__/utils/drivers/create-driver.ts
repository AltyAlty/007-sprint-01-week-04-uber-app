import request from 'supertest';
import { CreateDriverInputDTO } from '../../../src/drivers/dto/create-driver.input-dto';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { getCreateDriverInputDTO } from './get-create-driver-input-dto';
import { DriverViewModel } from '../../../src/drivers/models/driver.view-model';
import { SETTINGS } from '../../../src/core/settings/settings';

/*Создаем функцию "createDriver()", создающую водителя и возвращающую данные о нем, для целей тестирования.*/
export const createDriver = async (app: Express, driverDto?: CreateDriverInputDTO): Promise<DriverViewModel> => {
  /*Получаем DTO с корректными данными для создания водителя для целей тестирования.*/
  const defaultDriverData: CreateDriverInputDTO = getCreateDriverInputDTO();
  /*Разбавляем полученный DTO другими данными, если таковые были переданы.*/
  const testDriverData = { ...defaultDriverData, ...driverDto };

  /*Создаем водителя.*/
  const createdDriverResponse = await request(app)
    .post(SETTINGS.DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  /*Возвращаем тело ответа.*/
  return createdDriverResponse.body;
};
