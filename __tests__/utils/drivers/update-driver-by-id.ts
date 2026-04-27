import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { SETTINGS } from '../../../src/core/settings/settings';
import { getUpdateDriverInputDTO } from './get-update-driver-input-dto';
import { UpdateDriverInputDTO } from '../../../src/drivers/dto/update-driver.input-dto';

/*Создаем функцию "updateDriverById()", изменяющую данные водителя по ID и возвращающую их, для целей тестирования.*/
export const updateDriverById = async (
  app: Express,
  driverId: string,
  driverDto?: UpdateDriverInputDTO,
): Promise<void> => {
  /*Получаем DTO с корректными данными для изменения водителя для целей тестирования.*/
  const defaultDriverData: UpdateDriverInputDTO = getUpdateDriverInputDTO();
  /*Разбавляем полученный DTO другими данными, если таковые были переданы.*/
  const testDriverData = { ...defaultDriverData, ...driverDto };

  /*Изменяем водителя.*/
  const updatedDriverResponse = await request(app)
    .put(`${SETTINGS.DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent);

  /*Возвращаем тело ответа.*/
  return updatedDriverResponse.body;
};
