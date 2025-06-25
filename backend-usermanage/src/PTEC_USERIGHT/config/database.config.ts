export const databaseConfig = {
  user: process.env.DB_USER || 'ptec1',
  password: process.env.DB_PASSWORD || 'Pure@166',
  server: process.env.DB_SERVER || '10.15.100.227',
  database: process.env.DB_NAME || 'PTEC_USERSRIGHT',
  options: { encrypt: false }
};