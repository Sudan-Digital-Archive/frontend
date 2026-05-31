const defaultApiURL = 'https://api.sudandigitalarchive.com/sda-api/api/v1/'

const apiURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'development' ? defaultApiURL : defaultApiURL)

const appURLFrontend =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/'
    : 'https://sudandigitalarchive.com/'
export const appConfig = {
  apiURL: apiURL,
  appURLFrontend: appURLFrontend,
}

export const defaultPerPage = 10
export const perPageOptions = [10, 25, 50]
