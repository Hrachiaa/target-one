import OpenAI from 'openai';

export const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });
