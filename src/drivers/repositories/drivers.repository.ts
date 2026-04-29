import { Filter, ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { driversCollection } from '../../db/mongodb/mongo.db';
import { DriverType } from '../types/driver.type';
import { GetDriversListQueryInputDTO } from '../routers/input-dto/get-drivers-list-query.input-dto';
import { UpdateDriverAttributesInputDTO } from '../application/dto/update-driver-attributes.input-dto';

/*Репозиторий "driversRepository" для работы с данными по водителям в БД.*/
export const driversRepository = {
  /*Метод "findMany()" для поиска данных по водителям в БД.*/
  async findMany(queryDTO: GetDriversListQueryInputDTO): Promise<{ items: WithId<DriverType>[]; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchDriverNameTerm,
      searchDriverEmailTerm,
      searchVehicleMakeTerm,
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную
    страницу "pageNumber".*/
    const skip = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<DriverType> = {};
    /*Если в query-параметрах было указано имя водителя, то добавляем условие по полю "name".
    "$regex: searchDriverNameTerm" означает поиск по шаблону - по вхождению строки. "$options: 'i'" означает, что поиск
    будет без учета регистра.*/
    if (searchDriverNameTerm) filter.name = { $regex: searchDriverNameTerm, $options: 'i' };
    /*Если в query-параметрах был указан email водителя, то добавляем условие по полю "email".*/
    if (searchDriverEmailTerm) filter.email = { $regex: searchDriverEmailTerm, $options: 'i' };
    /*Если в query-параметрах был указан производитель машины водителя, то добавляем условие по полю "vehicle.make".*/
    if (searchVehicleMakeTerm) filter['vehicle.make'] = { $regex: searchVehicleMakeTerm, $options: 'i' };

    /*Просим коллекцию "driversCollection" найти данные по водителям в БД:
    1. ".find(filter)": выбираем документы по собранному фильтру.
    2. ".sort({ [sortBy]: sortDirection })": сортируем по полю сортировки, которое берется динамически из переменной
    "sortBy", а направление сортировки из переменной "sortDirection".
    3. ".skip(skip)": пропускаем нужное количество записей, чтобы взять записи для запрошенной страницы.
    4. ".limit(pageSize)": берем записей не больше размера запрошенной страницы.
    5. ".toArray()": превращаем курсор в обычный массив и возвращаем его.*/
    const items = await driversCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    /*Просим коллекцию "driversCollection" подсчитать общее количество документов, подходящих под фильтр, без учета
    пагинации.*/
    const totalCount = await driversCollection.countDocuments(filter);
    /*Возвращаем найденные данные по водителям.*/
    return { items, totalCount };
  },

  /*Метод "findById()" для поиска данных по водителю по ID в БД.*/
  async findById(id: string): Promise<WithId<DriverType>> {
    /*Просим коллекцию "driversCollection" найти данные по водителю по ID в БД.*/
    const res = await driversCollection.findOne({ _id: new ObjectId(id) });
    /*Если данные по водителю не были найдены, то выкидываем ошибку.*/
    if (!res) throw new RepositoryNotFoundError('Driver does not exist');
    /*Если данные по водителю были найдены, то возвращаем их.*/
    return res;
  },

  /*Метод "create()" для добавления нового водителя в БД.*/
  async create(newDriver: DriverType): Promise<string> {
    /*Просим коллекцию "driversCollection" создать нового водителя в БД.*/
    const insertResult = await driversCollection.insertOne(newDriver);
    /*Возвращаем ID созданного водителя.*/
    return insertResult.insertedId.toString();
  },

  /*Метод "update()" для изменения данных водителя по ID в БД.*/
  async update(id: string, dto: UpdateDriverAttributesInputDTO): Promise<void> {
    /*Просим коллекцию "driversCollection" изменить данные водителя по ID в БД.*/
    const updateResult = await driversCollection.updateOne(
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

    /*Если водитель не был найден, то выкидываем ошибку с информацией об этом.*/
    if (updateResult.matchedCount < 1) throw new RepositoryNotFoundError('Driver does not exist');
    return;
  },

  /*Метод "delete()" для удаления водителя по ID в БД.*/
  async delete(id: string): Promise<void> {
    /*Просим коллекцию "driversCollection" удалить водителя по ID в БД.*/
    const deleteResult = await driversCollection.deleteOne({ _id: new ObjectId(id) });
    /*Если водитель не был найден, то выкидываем ошибку с информацией об этом.*/
    if (deleteResult.deletedCount < 1) throw new RepositoryNotFoundError('Driver not exist');
    return;
  },
};
