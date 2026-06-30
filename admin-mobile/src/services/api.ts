import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Gunakan IP lokal mesin Anda atau 10.0.2.2 jika di Android Emulator
// Untuk sekarang, kita menggunakan localhost (atau IP network)
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyuntikkan token JWT ke setiap request
api.interceptors.request.use(
  async (config) => {
    let token = null;
    if (Platform.OS === 'web') {
      token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    } else {
      token = await SecureStore.getItemAsync('admin_token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
