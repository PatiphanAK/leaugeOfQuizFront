import axios from 'axios';


const apiClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/v1`,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
    }
});