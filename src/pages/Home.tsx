import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Movie, Genre } from '../types/movie'
import {
  getGenres,
  getMoviesByGenre,
  getPopularMovies,
} from '../api/movieService'

function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | 'all'>('all')
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadMovies = async (
    pageToLoad: number,
    genreOverride?: number | 'all',
  ) => {
    const genreToUse = genreOverride ?? selectedGenre

    try {
      setLoading(true)
      setError(null)
      const data =
        genreToUse === 'all'
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
      await loadMovies(1, selectedGenre)
    }

    loadInitialMovies()
  }, [selectedGenre])

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

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Filmes populares</h1>

      {error && <p>{error}</p>}

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <label>
          Gênero:{' '}
          <select
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

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        {movies.map((movie) => (
          <article
            key={movie.id}
            style={{
              backgroundColor: '#1f2933',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <Link
              to={`/movie/${movie.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100%', display: 'block' }}
                />
              )}
              <div style={{ padding: '0.75rem' }}>
                <h2
                  style={{
                    fontSize: '1rem',
                    margin: '0 0 0.5rem',
                  }}
                >
                  {movie.title}
                </h2>
                <p
                  style={{
                    fontSize: '0.875rem',
                    margin: 0,
                    opacity: 0.8,
                  }}
                >
                  Nota: {movie.vote_average.toFixed(1)}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </section>

      {movies.length > 0 && page < totalPages && (
        <div
          ref={loadMoreRef}
          style={{ height: '1px', marginTop: '2rem' }}
        />
      )}
    </main>
  )
}

export default Home
