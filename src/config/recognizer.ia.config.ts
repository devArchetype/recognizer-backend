import axios from 'axios';

export const recognizerIA = axios.create({
  baseURL: process.env.BASE_URL_IA,
  headers: {
    'Content-type': 'application/json',
  },
});
