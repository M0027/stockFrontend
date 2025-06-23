// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendstock-zyx4.onrender.com/api', // troque se necessário
});

expo