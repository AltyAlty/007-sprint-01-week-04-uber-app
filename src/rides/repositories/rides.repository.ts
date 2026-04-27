import { Ride } from '../types/ride';
import { ObjectId, WithId } from 'mongodb';
import { rideCollection } from '../../db/mongodb/mongo.db';

export const ridesRepository = {
  async findAll(): Promise<WithId<Ride>[]> {
    return rideCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ _id: new ObjectId(id) });
  },

  async findActiveRideByDriverId(driverId: string): Promise<WithId<Ride> | null> {
    return rideCollection.findOne({ driverId, finishedAt: null });
  },

  async create(newRide: Ride): Promise<WithId<Ride>> {
    const insertResult = await rideCollection.insertOne(newRide);
    return { ...newRide, _id: insertResult.insertedId };
  },

  async finishRide(id: string, finishedAt: Date) {
    const updateResult = await rideCollection.updateOne(
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
};
