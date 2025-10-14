import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.foodie.codelabs.lk/foodie-bff-service',
});

export default http;