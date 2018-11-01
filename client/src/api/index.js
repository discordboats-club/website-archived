import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.discordboats.club/api'
});

export default api;
