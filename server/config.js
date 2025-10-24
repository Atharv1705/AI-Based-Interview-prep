/* eslint-disable */
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepwise',
  cookie: {
    name: 'sid',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyBMBUXdD-7-V2iH4RC_DMrWok20lBhzerU',
  vapiApiKey: process.env.VAPI_API_KEY || 'fbf6b826-fc14-4c0f-b82c-7b9665b4cd41',
  vapiWebhookSecret: process.env.VAPI_WEBHOOK_SECRET || '',
};


