export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : 'http://localhost:8080';

export const API = {
    LOGIN: `${BASE_URL}/api/v1/login`,
    VERSION: `/api/v1/version`,
    USERS: `/api/v1/sysusers`,
    SYSUSER: `/api/v1/sysuser`,
    UPDATEROLE: `/api/v1/sysuser/role`,
    RESETPASSWORD: `/api/v1/sysuser/reset/password`,
    NEWREPORT: `/api/v1/report/new`,
};

export default API;