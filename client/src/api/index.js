import axios from 'axios';

const BASE = process.env.REACT_APP_API_BASE || 'https://api.discordboats.club';

const api = axios.create({
    baseURL: `${BASE}/api`
});

export default api;

export BASE;
