import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const HOST: string = process.env.HOST || '0.0.0.0';
export const PORT: number = Number(process.env.PORT) || 3500;

export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const LOGGING_LEVEL = process.env.LOGGING_LEVEL || 'info';
export const SHOW_DETAILED_ERROR: boolean = process.env.SHOW_DETAILED_ERROR === 'true' ? true : false;
export const SERVER_ERROR = 'Server Error';