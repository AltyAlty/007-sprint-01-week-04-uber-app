import { body } from 'express-validator';
import { Currency } from '../types/ride';

export const clientNameValidation = body('clientName')
  .isString()
  .withMessage('status should be a string')
  .trim()
  .isLength({ min: 3, max: 100 });

export const driverIdValidation = body('driverId')
  .isString()
  .withMessage('ID must be a string')
  .trim()
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

export const priceValidation = body('price')
  /*Проверяем, что поле "price" является числом большим 0.*/
  .isFloat({ gt: 0 })
  .withMessage('price must be a positive number');

export const currencyValidation = body('currency')
  .isString()
  .withMessage('currency should be a string')
  .trim()
  .isIn(Object.values(Currency))
  .withMessage('currency must be either "usd" or "eu"');

export const startAddressValidation = body('fromAddress')
  .isString()
  .withMessage('startAddress should be a string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const endAddressValidation = body('toAddress')
  .isString()
  .withMessage('endAddress should be a string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const rideInputDtoValidation = [
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
