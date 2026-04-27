import { Driver } from '../types/driver';
import { ObjectId, WithId } from 'mongodb';
import { driverCollection } from '../../db/mongodb/mongo.db';
import { UpdateDriverInputDTO } from '../dto/update-driver.input-dto';

/*Создаем репозиторий "driversRepository" для работы с данными по водителям в БД.*/
export const driversRepository = {
  /*Создаем метод "findAll()" для получения данных по всем водителям из БД.*/
  async findAll(): Promise<WithId<Driver>[]> {
    return driverCollection.find().toArray();
  },

  /*Создаем метод "findById()" для получения данных по водителю по ID из БД.*/
  async findById(id: string): Promise<WithId<Driver> | null> {
    return driverCollection.findOne({ _id: new ObjectId(id) });
  },

  /*Создаем метод "create()" для добавления нового водителя в БД.*/
  async create(newDriver: Driver): Promise<WithId<Driver>> {
    const insertResult = await driverCollection.insertOne(newDriver);
    return { ...newDriver, _id: insertResult.insertedId };
  },

  /*Создаем метод "update()" для изменения данных водителя по ID в БД.*/
  async update(id: string, dto: UpdateDriverInputDTO): Promise<void> {
    const updateResult = await driverCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          email: dto.email,
          vehicle: {
            make: dto.vehicleMake,
            model: dto.vehicleModel,
            year: dto.vehicleYear,
            licensePlate: dto.vehicleLicensePlate,
            description: dto.vehicleDescription,
            features: dto.vehicleFeatures,
          },
        },
      },
    );

    if (updateResult.matchedCount < 1) throw new Error('Driver does not exist');
    return;
  },

  /*Создаем метод "delete()" для удаления водителя по ID в БД.*/
  async delete(id: string): Promise<void> {
    const deleteResult = await driverCollection.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount < 1) throw new Error('Driver does not exist');
    return;
  },
};
