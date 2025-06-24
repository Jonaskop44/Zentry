export const API_URL_DEVELOPMENT = `${process.env.NEXT_PUBLIC_BACKEND_URL_DEVELOPMENT}/api/v1`;
const API_URL_PRODUCTION = `${process.env.NEXT_PUBLIC_BACKEND_URL_PRODUCTION}/api/v1`;

export const API_URL =
  process.env.NODE_ENV === "production"
    ? API_URL_PRODUCTION
    : API_URL_DEVELOPMENT;
