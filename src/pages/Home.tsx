import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Lista de filmes populares virá aqui.</p>
      <p>
        Exemplo de navegação: <Link to="/movie/1">Ver detalhes do filme 1</Link>
      </p>
    </div>
  )
}

export default Home

