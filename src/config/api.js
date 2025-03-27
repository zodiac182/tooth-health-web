export const BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : 'http://localhost:8080';

export const API = {
    LOGIN: `${BASE_URL}/api/v1/login`,
    VERSION: `/api/v1/version`,
    SYSUSERS: `/api/v1/sysusers`,
    SYSUSER: `/api/v1/sysuser`,
    ROLE: `/api/v1/sysuser/role`,
    RESETPASSWORD: `/api/v1/sysuser/reset/password`,
    RECORD: `/api/v1/tooth/record`,
    RECORDS: `/api/v1/tooth/record/all`,
    CUSER: '/api/v1/cuser',
};

export default API;