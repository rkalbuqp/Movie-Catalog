import axios from 'axios'
import type { Movie, Genre, PaginatedResponse } from '../types/movie'

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB,
    language: 'pt-BR',
  },
})

export const getPopularMovies = async (
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await api.get<PaginatedResponse<Movie>>('/movie/popular', {
    params: { page },
  })
  return data
}

export const searchMovies = async (
  query: string,
  page = 1,
): Promise<PaginatedResponse<Movie>> => {
  const { data } = await api.get<PaginatedResponse<Movie>>('/search/movie', {
    params: { query, page },
  })
  return data
}

export const getMovieDetails = async (id: string): Promise<Movie> => {
  const { data } = await api.get<Movie>(`/movie/${id}`)
  return data
}

export const getGenres = async (): Promise<Genre[]> => {
  const { data } = await api.get<{ genres: Genre[] }>('/genre/movie/list')
  return data.genres
}
