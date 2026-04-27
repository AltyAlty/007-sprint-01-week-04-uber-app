import { Collection, Db, MongoClient } from 'mongodb';
import { Driver } from '../../drivers/types/driver';
import { Ride } from '../../rides/types/ride';
import { SETTINGS } from '../../core/settings/settings';

export let client: MongoClient;
export let driverCollection: Collection<Driver>;
export let rideCollection: Collection<Ride>;

/*Создаем функцию "runDB()" для подключения к серверу MongoDB.*/
export const runDB = async (url: string, dbName: string): Promise<void> => {
  /*Создаем клиента для MongoDB.*/
  client = new MongoClient(url);
  /*Указываем БД, к которой будет подключаться клиент для MongoDB.*/
  const db: Db = client.db(dbName);
  /*Создаем коллекции в указанной БД.*/
  driverCollection = db.collection<Driver>(SETTINGS.DRIVER_COLLECTION_NAME);
  rideCollection = db.collection<Ride>(SETTINGS.RIDE_COLLECTION_NAME);

  try {
    /*Присоединяем клиента для MongoDB к серверу и проверяем соединение.*/
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Successfully connected to the MongoDB server');
  } catch (error) {
    await client.close();
    throw new Error(`❌ Cannot connect to the MongoDB server: ${error}`);
  }
};

/*Создаем функцию "stopDb()" для отключения от сервера MongoDB.*/
export const stopDb = async () => {
  if (!client) throw new Error(`❌ No MongoDB clients`);
  await client.close();
};
