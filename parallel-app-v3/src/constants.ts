const appConfig = {
  apiURL: import.meta.env.VITE_API_URL || 'http://api.sudandigitalarchive.com/sda-api/api/v1/',
  frontendURL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
}

export { appConfig }
