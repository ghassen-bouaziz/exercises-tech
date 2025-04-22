class api {
    static baseUrl = '/api';
    static token = localStorage.getItem('token');

    constructor() {
        this.baseUrl = '/api';
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken() {
        return this.token;
    }

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`);
            const data = await response.json();

            if (!response.ok) {
                return { ok: false, error: data.message || 'Failed to fetch data' };
            }

            return { ok: true, data };
        } catch (error) {
            console.error('API GET error:', error);
            return { ok: false, error: error.message };
        }
    }

    async post(endpoint, body) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                return { ok: false, error: data.message || 'Something went wrong' };
            }

            return { ok: true, data };
        } catch (error) {
            console.error('API POST error:', error);
            return { ok: false, error: error.message };
        }
    }

    async put(endpoint, body) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                return { ok: false, error: data.message || 'Failed to update data' };
            }

            return { ok: true, data };
        } catch (error) {
            console.error('API PUT error:', error);
            return { ok: false, error: error.message };
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 204) {
                return { ok: true };
            }

            const data = await response.json();

            if (!response.ok) {
                return { ok: false, error: data.message || 'Failed to delete data' };
            }

            return { ok: true, data };
        } catch (error) {
            console.error('API DELETE error:', error);
            return { ok: false, error: error.message };
        }
    }
};

export default api;
