import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const formatResponse = (success, data = null, message = '', statusCode = 200) => ({
  statusCode,
  body: {
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  },
});

export const validatePhone = (phone) => /^\d{10}$/.test(phone);
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);