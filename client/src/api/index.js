import axios from 'axios';

const BASE = 'https://api.discordboats.club';

const api = axios.create({
    baseURL: `${BASE}/api`
});

export default api;

export BASE;
