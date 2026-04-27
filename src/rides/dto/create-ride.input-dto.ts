import { Currency } from '../types/ride';

export type CreateRideInputDTO = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
