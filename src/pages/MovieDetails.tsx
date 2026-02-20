import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import { getMovieDetails } from '../api/movieService'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        const data = await getMovieDetails(id)
        setMovie(data)
      } catch {
        setError('Erro ao carregar detalhes do filme.')
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id])

  if (loading) {
    return (
      <main style={{ padding: '2rem' }}>
        <p>Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <p>{error}</p>
        <p>
          <Link to="/">Voltar para a home</Link>
        </p>
      </main>
    )
  }

  if (!movie) {
    return null
  }

  const bannerUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : undefined

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : undefined

  return (
    <main>
      <section
        style={{
          position: 'relative',
          minHeight: '300px',
          color: '#fff',
          backgroundColor: '#111827',
          backgroundImage: bannerUrl
            ? `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url(${bannerUrl})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            padding: '2rem',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              style={{
                width: '200px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                flexShrink: 0,
              }}
            />
          )}

          <div>
            <h1 style={{ margin: '0 0 0.5rem' }}>{movie.title}</h1>
            <p style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>
              Nota: {movie.vote_average.toFixed(1)}
            </p>
            <p style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>
              Data de lançamento: {movie.release_date}
            </p>
            {movie.genres && movie.genres.length > 0 && (
              <p style={{ margin: '0 0 1rem', opacity: 0.9 }}>
                Gêneros: {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: '960px',
          margin: '2rem auto',
          padding: '0 2rem 2rem',
        }}
      >
        <h2>Sinopse</h2>
        <p style={{ lineHeight: 1.6 }}>{movie.overview}</p>
        <p style={{ marginTop: '2rem' }}>
          <Link to="/">Voltar para a home</Link>
        </p>
      </section>
    </main>
  )
}

export default MovieDetails
