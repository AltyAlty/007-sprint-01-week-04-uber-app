import { CreateRideInputDTO } from '../../../src/rides/dto/create-ride.input-dto';
import { Currency } from '../../../src/rides/types/ride';

export const getCreateRideInputDTO = (driverId: string): CreateRideInputDTO => {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
};
