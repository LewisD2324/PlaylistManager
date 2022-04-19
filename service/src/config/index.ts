import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const HOST: string = process.env.HOST || '0.0.0.0';
export const PORT: number = Number(process.env.PORT) || 3500;

export const CLIENT_ID: string = process.env.CLIENT_ID || 'ec33a96061574e7bb1fe4f5cbaa27fa4';
export const CLIENT_SECRET: string = process.env.CLIENT_SECRET || '98caaabc517b4961ba0d381c17e0a6e8';
export const REDIRECT_URI: string = process.env.REDIRECT_URI || 'http://localhost:8888/callback';



export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const LOGGING_LEVEL = process.env.LOGGING_LEVEL || 'info';
export const SHOW_DETAILED_ERROR: boolean = process.env.SHOW_DETAILED_ERROR === 'true' ? true : false;
export const SERVER_ERROR = 'Server Error';