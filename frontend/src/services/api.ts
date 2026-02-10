const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Utility function to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Utility function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    const headers: any = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(url, {
        ...options,
        headers,
    });
};

// Auth API
export const authAPI = {
    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    },

    getCurrentUser: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
        return response.json();
    },

    updateSubscription: async (subscriptionPlan: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/auth/subscription`, {
            method: 'PUT',
            body: JSON.stringify({ subscriptionPlan }),
        });
        return response.json();
    },
};

// Courses API
export const coursesAPI = {
    getAllCourses: async (params?: {
        category?: string;
        level?: string;
        search?: string;
    }) => {
        const queryParams = new URLSearchParams(params as any).toString();
        const url = `${API_BASE_URL}/courses${queryParams ? `?${queryParams}` : ''}`;
        const response = await fetch(url);
        return response.json();
    },

    getCourseById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`);
        return response.json();
    },

    createCourse: async (data: any) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    updateCourse: async (id: string, data: any) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteCourse: async (id: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    enrollInCourse: async (id: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses/${id}/enroll`, {
            method: 'POST',
        });
        return response.json();
    },

    getEnrolledCourses: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses/enrolled/my-courses`);
        return response.json();
    },

    addRating: async (id: string, rating: number, comment?: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/courses/${id}/rating`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment }),
        });
        return response.json();
    },
};

// Progress API
export const progressAPI = {
    getUserProgress: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/progress/all`);
        return response.json();
    },

    getCourseProgress: async (courseId: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/progress/${courseId}`);
        return response.json();
    },

    updateModuleCompletion: async (
        courseId: string,
        moduleIndex: number,
        timeSpent?: number
    ) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/progress/${courseId}/module`, {
            method: 'PUT',
            body: JSON.stringify({ moduleIndex, timeSpent }),
        });
        return response.json();
    },

    submitEvaluation: async (courseId: string, answers: number[]) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/progress/${courseId}/evaluation`, {
            method: 'POST',
            body: JSON.stringify({ answers }),
        });
        return response.json();
    },
};

// Users API
export const usersAPI = {
    getUsers: async (role?: string) => {
        const url = `${API_BASE_URL}/users${role ? `?role=${role}` : ''}`;
        const response = await fetchWithAuth(url);
        return response.json();
    },

    createUser: async (data: any) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/users`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.json();
    },

    deleteUser: async (id: string) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    }
};

// Certifications API
export const certificationsAPI = {
    getMyCertifications: async () => {
        const response = await fetchWithAuth(`${API_BASE_URL}/certifications/my-certifications`);
        return response.json();
    },

    issueCertificate: async (courseId: string, score: number) => {
        const response = await fetchWithAuth(`${API_BASE_URL}/certifications/issue`, {
            method: 'POST',
            body: JSON.stringify({ courseId, score })
        });
        return response.json();
    }
};

// Storage utilities
export const storage = {
    setToken: (token: string) => {
        localStorage.setItem('authToken', token);
    },

    getToken: () => {
        return localStorage.getItem('authToken');
    },

    removeToken: () => {
        localStorage.removeItem('authToken');
    },

    setUser: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    removeUser: () => {
        localStorage.removeItem('user');
    },

    clear: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
};
