export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || '',

  DRIVERS_PATH: '/api/drivers',
  RIDES_PATH: '/api/rides',
  TESTING_PATH: '/api/testing',

  DB_NAME: process.env.DB_NAME || '007-sprint-01-week-04-uber-app',
  TEST_DB_NAME: process.env.DB_NAME || '007-sprint-01-week-04-uber-app-test',

  DRIVER_COLLECTION_NAME: 'drivers',
  RIDE_COLLECTION_NAME: 'rides',

  BASIC_AUTH_ADMIN_USERNAME: process.env.BASIC_AUTH_ADMIN_USERNAME,
  BASIC_AUTH_ADMIN_PASSWORD: process.env.BASIC_AUTH_ADMIN_PASSWORD,
};
