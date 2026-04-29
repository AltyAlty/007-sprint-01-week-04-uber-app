import { Filter, ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { ridesCollection } from '../../db/mongodb/mongo.db';
import { RideType } from '../types/ride.type';
import { GetRidesListQueryInputDTO } from '../routers/input-dto/get-rides-list-query.input-dto';

export const ridesRepository = {
  async findMany(queryDTO: GetRidesListQueryInputDTO): Promise<{ items: WithId<RideType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDTO;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<RideType> = {};

    const [items, totalCount] = await Promise.all([
      ridesCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      ridesCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<RideType>> {
    const res = await ridesCollection.findOne({ _id: new ObjectId(id) });
    if (!res) throw new RepositoryNotFoundError('Ride does not exist');
    return res;
  },

  async findActiveRideByDriverId(driverId: string): Promise<WithId<RideType> | null> {
    return ridesCollection.findOne({ driverId, finishedAt: null });
  },

  async createRide(newRide: RideType): Promise<string> {
    const insertResult = await ridesCollection.insertOne(newRide);
    return insertResult.insertedId.toString();
  },

  async finishRide(id: string, finishedAt: Date) {
    const updateResult = await ridesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          finishedAt,
          updatedAt: new Date(),
        },
      },
    );

    if (updateResult.matchedCount < 1) throw new Error('Ride does not exist');
    return;
  },

  async findRidesByDriver(
    queryDTO: GetRidesListQueryInputDTO,
    driverId: string,
  ): Promise<{ items: WithId<RideType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDTO;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<RideType> = { 'driver.id': driverId };

    const [items, totalCount] = await Promise.all([
      ridesCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      ridesCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },
};
