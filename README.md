# Movie Catalog

Aplicação de catálogo de filmes consumindo a API do The Movie Database (TMDB), com foco em arquitetura escalável, tipagem forte e experiência de uso profissional (infinite scroll, busca com debounce, filtro por gênero, dark mode e skeletons de carregamento).

Projeto desenvolvido com arquitetura baseada em service layer e tipagem forte das respostas da API para garantir escalabilidade e segurança de tipos.

---

## 🔗 Deploy

Substitua pela URL da sua aplicação assim que publicar:

`https://seu-deploy-aqui.com`

---

## 📸 Prints

Sugestão de prints para destacar no README (adicione os arquivos em uma pasta como `./.github/screenshots` e atualize os paths abaixo):

- Home com lista de filmes populares, busca, filtro por gênero e infinite scroll  
  `![Home](./.github/screenshots/home.png)`
- Página de detalhes do filme com banner, poster, sinopse e gêneros  
  `![Detalhes do filme](./.github/screenshots/movie-details.png)`
- Tema claro e escuro com o toggle de dark mode  
  `![Dark mode](./.github/screenshots/dark-mode.png)`

---

## 🧪 Funcionalidades

- Listagem de filmes populares com paginação infinita (infinite scroll)
- Busca de filmes com debounce (evita requisições desnecessárias à API)
- Filtro por gênero usando o endpoint `/discover/movie`
- Página de detalhes `/movie/:id` com:
  - banner (backdrop)
  - poster
  - sinopse
  - nota média
  - data de lançamento
  - gêneros
- Dark mode com toggle global persistido em `localStorage`
- Skeletons de carregamento na Home e na página de detalhes
- Tratamento de erros com mensagens amigáveis e botão de “Tentar novamente”

---

## 🛠 Tecnologias

- **React 19** (SPA)
- **TypeScript** (tipagem forte em toda a aplicação)
- **Vite** (bundler e dev server)
- **React Router DOM** (roteamento)
- **Axios** (cliente HTTP)
- **@tanstack/react-query** (já disponível nas dependências para futura evolução de data fetching)
- **CSS Modules** (estilização modular e responsiva)
- **TMDB API** (The Movie Database) como fonte de dados

---

## 🏗 Arquitetura

A aplicação segue uma arquitetura simples, mas facilmente escalável:

- **Service Layer (`src/api`)**  
  Camada responsável por todas as chamadas HTTP à API do TMDB, centralizando URLs, parâmetros e tipos de retorno.

- **Tipagens fortes (`src/types`)**  
  Interfaces TypeScript para `Movie`, `Genre` e respostas paginadas (`PaginatedResponse<T>`), garantindo que toda a aplicação conheça exatamente a forma dos dados.

- **Páginas (`src/pages`)**  
  Componentes de alto nível para cada rota: `Home` (lista de filmes) e `MovieDetails` (detalhes do filme).

- **Hooks (`src/hooks`)**  
  Hooks reutilizáveis como `useDebounce` para controle de digitação em campos de busca.

- **Context (`src/context`)**  
  `ThemeContext` encapsula o estado de tema (light/dark), expondo `theme` e `toggleTheme` para qualquer componente.

- **Roteamento (`src/App.tsx`)**  
  Configuração central de rotas com `react-router-dom`, aplicando o layout e o header com o toggle de tema.

---

## 📂 Estrutura de pastas

Estrutura principal do projeto:

```bash
src/
  api/
    movieService.ts      # Service layer com chamadas à API do TMDB
  assets/
  components/
  context/
    ThemeContext.tsx     # Contexto de tema (dark/light)
  hooks/
    useDebounce.ts       # Hook de debounce genérico
  pages/
    Home.tsx             # Lista de filmes, busca, filtro por gênero, infinite scroll
    Home.module.css      # Estilos modularizados da Home
    MovieDetails.tsx     # Página de detalhes do filme
    MovieDetails.module.css
  types/
    movie.ts             # Tipagens de Movie, Genre e PaginatedResponse
  App.tsx                # Rotas + layout principal + toggle de tema
  App.css
  main.tsx
  index.css              # Estilos globais e tokens de tema
```

---

## 🔐 Integração com TMDB (variáveis de ambiente)

Para consumir a API do TMDB, o projeto utiliza variáveis de ambiente do Vite (`import.meta.env`):

- `VITE_TMDB`  
  Chave da API usada como `api_key` nas requisições.

Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_TMDB="sua_api_key_aqui"
```

---

## 📡 Service Layer (API)

Arquivo: `src/api/movieService.ts`

Principais funções:

- `getPopularMovies(page?: number)`  
  Busca filmes populares (`/movie/popular`) com resposta tipada como `PaginatedResponse<Movie>`.

- `searchMovies(query: string, page?: number)`  
  Busca filmes pelo nome (`/search/movie`).

- `getMovieDetails(id: string)`  
  Detalhes de um filme específico (`/movie/:id`), incluindo gêneros.

- `getGenres()`  
  Lista de gêneros (`/genre/movie/list`).

- `getMoviesByGenre(genreId: number, page?: number)`  
  Lista filmes filtrando por gênero (`/discover/movie?with_genres=ID`).

Todas as funções retornam dados já tipados, o que facilita o consumo nas páginas e evita erros de tipo.

---

## 🧱 Tipagem forte

Arquivo: `src/types/movie.ts`

- `Movie`  
  Inclui campos como `id`, `title`, `overview`, `poster_path`, `backdrop_path`, `release_date`, `vote_average`, `genre_ids` e `genres?: Genre[]` (para a resposta de detalhes).

- `Genre`  
  Representa um gênero com `id` e `name`.

- `PaginatedResponse<T>`  
  Modelo genérico para respostas paginadas da API (`page`, `results`, `total_pages`, `total_results`).

Essa abordagem garante que qualquer mudança na API seja percebida em tempo de compilação.

---

## 🎨 UX: Loading, Erros, Infinite Scroll, Busca e Filtro

### Loading skeleton

- Home: skeleton de cards enquanto a primeira página de filmes é carregada.
- MovieDetails: skeleton do banner e da sinopse enquanto os detalhes são buscados.

### Tratamento de erros

- Mensagens de erro claras na Home e nos Detalhes.
- Botão “Tentar novamente” que reexecuta a requisição.
- Link de retorno para a Home na página de detalhes.

### Infinite scroll

- Implementado com `IntersectionObserver` na Home.
- Quando o último “sentinela” entra em viewport, a próxima página é carregada automaticamente.

### Busca com debounce

- Input de busca na Home controlado por `searchTerm` e `useDebounce`.
- A API só é chamada após o usuário parar de digitar por alguns milissegundos.

### Filtro por gênero

- Select de gêneros alimentado por `getGenres`.
- Quando o usuário troca de gênero, a lista é resetada e recarregada com `/discover/movie?with_genres=ID`.

---

## 🌙 Dark Mode

O tema é controlado por `ThemeContext`:

- Tema inicial:
  - lido do `localStorage` se existir
  - ou, se não houver, respeita `prefers-color-scheme` do sistema
- Estado do tema é salvo em `localStorage` e aplicado no `document.documentElement` via `data-theme`.
- Estilos em `index.css` usam:
  - `:root[data-theme='dark']`
  - `:root[data-theme='light']`

O toggle de tema fica no header (componente `ThemeToggle` em `App.tsx`).

---

## 🚀 Como rodar o projeto

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` com a sua chave do TMDB.

Rode em ambiente de desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview do build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

---

## 💡 Decisões técnicas

- **Service layer dedicada**  
  Todas as chamadas à API estão em `src/api/movieService.ts`, facilitando manutenção, testes e evolução (ex.: troca de API, autenticação, cache).

- **Tipagem forte end-to-end**  
  As respostas (populares, busca, detalhes, gêneros) são modeladas em `src/types`, permitindo feedback imediato do TypeScript ao consumir a API.

- **Responsividade e CSS Modules**  
  Páginas usam módulos CSS (`Home.module.css`, `MovieDetails.module.css`) para evitar conflitos de estilos e manter coesão visual, com media queries para mobile.

- **UX de nível profissional**  
  Skeletons, infinite scroll, busca com debounce, filtro por gênero, dark mode e tratamento de erros constroem uma experiência próxima a produtos usados em produção.

- **Tema global com Context API**  
  O estado de dark mode é global, desacoplado das páginas, e persiste entre sessões via `localStorage`.

---

## 📌 Próximos passos sugeridos

- Integrar **React Query** de fato para cache de requisições, revalidação e estados de carregamento/erro padronizados.
- Adicionar testes unitários e de integração (por exemplo com Vitest e Testing Library).
- Criar componentes reutilizáveis (ex.: `MovieCard`, `MovieGrid`, `Layout`) para reduzir duplicação.

