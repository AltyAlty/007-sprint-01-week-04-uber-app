import { VehicleFeature } from '../types/driver';

/*DTO для входных данных для создания нового водителя.*/
export type CreateDriverInputDTO = {
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
