const API_URL = 'http://localhost:5000/api';

export const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'x-auth-token': token } : {})
    };
};

export const apiCall = async (endpoint: string, method: string = 'GET', body: any = null) => {
    const options: RequestInit = {
        method,
        headers: getHeaders(),
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.msg || 'Something went wrong');
    }
    return data;
};
