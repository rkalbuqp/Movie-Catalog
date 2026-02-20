import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Movie, Genre } from '../types/movie'
import {
  getGenres,
  getMoviesByGenre,
  getPopularMovies,
  searchMovies,
} from '../api/movieService'
import { useDebounce } from '../hooks/useDebounce'
import styles from './Home.module.css'

function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadMovies = async (
    pageToLoad: number,
    genreOverride?: number | 'all',
    searchOverride?: string,
  ) => {
    const genreToUse = genreOverride ?? selectedGenre
    const searchToUse = searchOverride ?? debouncedSearchTerm

    try {
      setLoading(true)
      setError(null)
      const data = searchToUse.trim()
        ? await searchMovies(searchToUse, pageToLoad)
        : genreToUse === 'all'
          ? await getPopularMovies(pageToLoad)
          : await getMoviesByGenre(genreToUse, pageToLoad)
      setMovies((prev) =>
        pageToLoad === 1 ? data.results : [...prev, ...data.results],
      )
      setPage(data.page)
      setTotalPages(data.total_pages)
    } catch {
      setError('Erro ao carregar filmes populares.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadInitialMovies = async () => {
      setMovies([])
      setPage(1)
      setTotalPages(1)
      await loadMovies(1, selectedGenre, debouncedSearchTerm)
    }

    loadInitialMovies()
  }, [selectedGenre, debouncedSearchTerm])

  useEffect(() => {
    const loadAllGenres = async () => {
      try {
        const data = await getGenres()
        setGenres(data)
      } catch {
        setGenres([])
      }
    }

    loadAllGenres()
  }, [])

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && page < totalPages && !loading) {
          loadMovies(page + 1)
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1,
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [page, totalPages, loading])

  const showSkeleton = loading && movies.length === 0

  return (
    <main className={styles.page}>
      <h1>Filmes populares</h1>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button
              type="button"
              className={styles.errorButton}
              onClick={() => loadMovies(page || 1)}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar filmes..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <label>
          Gênero:{' '}
          <select
            className={styles.select}
            value={selectedGenre === 'all' ? '' : selectedGenre}
            onChange={(event) => {
              const value = event.target.value
              setSelectedGenre(value === '' ? 'all' : Number(value))
            }}
          >
            <option value="">Todos</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className={styles.grid}>
        {showSkeleton
          ? Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))
          : movies.map((movie) => (
              <article key={movie.id} className={styles.card}>
                <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
                  {movie.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className={styles.poster}
                    />
                  )}
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{movie.title}</h2>
                    <p className={styles.cardRating}>
                      Nota: {movie.vote_average.toFixed(1)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
      </section>

      {movies.length > 0 && page < totalPages && (
        <div ref={loadMoreRef} style={{ height: '1px', marginTop: '2rem' }} />
      )}
    </main>
  )
}

export default Home
