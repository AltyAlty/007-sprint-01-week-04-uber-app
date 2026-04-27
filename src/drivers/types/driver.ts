/*Тип для списка фич машин.*/
export enum VehicleFeature {
  WiFi = 'wi-fi',
  ChildSeat = 'child-seat',
  PetFriendly = 'pet-friendly',
}

/*Тип для водителей.*/
export type Driver = {
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
