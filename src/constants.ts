const apiURL =
  import.meta.env.MODE === 'development'
    ? 'https://api.sudandigitalarchive.com/sda-api/api/v1/'
    : 'https://api.sudandigitalarchive.com/sda-api/api/v1/'

const appURLFrontend =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5173/'
    : 'https://sudandigitalarchive.com/'
export const appConfig = {
  apiURL: apiURL,
  appURLFrontend: appURLFrontend,
}

export const COLLECTIONS_EN = [
  {
    id: 'yale-humanitarian-research-lab',
    title: 'Yale Humanitarian Research Labs reports',
    description:
      'Reports from the Yale Humanitarian Research Lab on human rights violations in Sudan.',
    filters: {
      lang: 'english',
      metadata_subjects: [37],
      metadata_subjects_inclusive_filter: true,
    },
  },
]

export const COLLECTIONS_AR: typeof COLLECTIONS_EN = []
