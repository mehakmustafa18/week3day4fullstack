import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 15000
});

// Auto-attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => Promise.reject(error));

// Handle 401/403 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const loginUser    = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe        = ()     => API.get('/auth/me');

// ── Projects ──────────────────────────────────────────
export const getProjects    = ()         => API.get('/projects');
export const getProject     = (id)       => API.get(`/projects/${id}`);
export const createProject  = (data)     => API.post('/projects', data);
export const updateProject  = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject  = (id)       => API.delete(`/projects/${id}`);

// ── Members ───────────────────────────────────────────
export const getMembers    = ()         => API.get('/members');
export const getMember     = (id)       => API.get(`/members/${id}`);
export const createMember  = (data)     => API.post('/members', data);
export const updateMember  = (id, data) => API.put(`/members/${id}`, data);
export const deleteMember  = (id)       => API.delete(`/members/${id}`);

// ── Health ────────────────────────────────────────────
export const checkHealth = () => API.get('/health');

export default API;
