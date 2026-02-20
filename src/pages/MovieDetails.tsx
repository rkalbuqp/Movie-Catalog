import { useParams, Link } from 'react-router-dom'

function MovieDetails() {
  const { id } = useParams()

  return (
    <div>
      <h1>Detalhes do filme</h1>
      <p>ID do filme: {id}</p>
      <p>
        <Link to="/">Voltar para a home</Link>
      </p>
    </div>
  )
}

export default MovieDetails

