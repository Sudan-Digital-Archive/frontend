const apiURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001/api/v1/'
    : 'https://api.sudandigitalarchive.com/sda-api/api/v1/'

const appURLFrontend =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/'
    : 'https://sudandigitalarchive.com/'
export const appConfig = {
  apiURL: apiURL,
  appURLFrontend: appURLFrontend,
}
