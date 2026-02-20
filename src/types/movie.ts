export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
}

export interface Genre {
  id: number
  name: string
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

