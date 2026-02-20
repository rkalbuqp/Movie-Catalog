import axios from 'axios'

const apiKey = import.meta.env.VITE_TMDB
const accessToken = import.meta.env.VITE_TMDB_API_KEY

const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    api_key: apiKey,
  },
})

export async function getPopularMovies(page = 1) {
  const response = await tmdbClient.get('/movie/popular', {
    params: { page },
  })

  return response.data
}

