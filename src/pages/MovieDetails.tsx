import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { Movie } from '../types/movie'
import { getMovieDetails } from '../api/movieService'
import styles from './MovieDetails.module.css'

function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    loadMovie()
  }, [id])

  if (loading && !movie) {
    return (
      <main className={styles.page}>
        <section className={styles.skeletonBanner} />
        <section className={styles.synopsisSection}>
          <div className={styles.skeletonParagraph} />
          <div className={styles.skeletonParagraph} />
          <div className={styles.skeletonParagraph} />
        </section>
      </main>
    )
  }

  if (error && !movie) {
    return (
      <main className={styles.page}>
        <section className={styles.synopsisSection}>
          <p>{error}</p>
          <div className={styles.backLink}>
            <button type="button" onClick={loadMovie}>
              Tentar novamente
            </button>
          </div>
          <p className={styles.backLink}>
            <Link to="/">Voltar para a home</Link>
          </p>
        </section>
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
    <main className={styles.page}>
      <section
        className={styles.banner}
        style={
          bannerUrl
            ? {
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url(${bannerUrl})`,
              }
            : undefined
        }
      >
        <div className={styles.bannerContent}>
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              className={styles.poster}
            />
          )}

          <div>
            <h1 className={styles.infoTitle}>{movie.title}</h1>
            <p className={styles.infoText}>
              Nota: {movie.vote_average.toFixed(1)}
            </p>
            <p className={styles.infoText}>
              Data de lançamento: {movie.release_date}
            </p>
            {movie.genres && movie.genres.length > 0 && (
              <p className={styles.infoText}>
                Gêneros: {movie.genres.map((genre) => genre.name).join(', ')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.synopsisSection}>
        <h2>Sinopse</h2>
        <p>{movie.overview}</p>
        <p className={styles.backLink}>
          <Link to="/">Voltar para a home</Link>
        </p>
      </section>
    </main>
  )
}

export default MovieDetails
