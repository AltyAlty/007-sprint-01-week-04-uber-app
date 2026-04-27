import { WithId } from 'mongodb';
import { Driver } from '../../types/driver';
import { DriverViewModel } from '../../models/driver.view-model';

/*Создаем функцию "mapToDriverViewModel()" для преобразования объектов с данными о водителях, полученных из БД, в
объекты типа "DriverViewModel".*/
export const mapToDriverViewModel = (driver: WithId<Driver>): DriverViewModel => {
  return {
    id: driver._id.toString(),
    name: driver.name,
    phoneNumber: driver.phoneNumber,
    email: driver.email,
    vehicle: driver.vehicle,
    createdAt: driver.createdAt,
  };
};
