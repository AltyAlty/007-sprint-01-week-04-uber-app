import { VehicleFeature } from '../types/driver';

/*Исходящая модель для отправки клиенту данных о созданном водителе.*/
export type DriverViewModel = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    description: string | null;
    features: VehicleFeature[];
  };
  createdAt: Date;
};
