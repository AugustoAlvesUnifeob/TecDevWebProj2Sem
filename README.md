# TecDevWebProj2Sem
Augusto Barreto Gomes Alves RA: 25000112

## API de avaliações

A API usa Express, Sequelize e MySQL. Configure `CHAVETOKEN` no arquivo `.env` e confira os dados de conexão em `db/conn.js` antes de iniciar com `npm start`.

Os tipos de usuário são numéricos:

- `1`: administrador (cadastre essa conta diretamente no banco; o cadastro público não permite criar administradores).
- `2`: cliente.
- `3`: responsável por estabelecimento.

O cadastro público (`POST /api/auth/register`) recebe `name`, `email`, `password` (mínimo de 8 caracteres) e `tipo` (`2` ou `3`). Após o login (`POST /api/auth/login`), envie o token como `Authorization: Bearer SEU_JWT`.

## Rotas

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Público | Cadastra cliente ou responsável |
| `POST` | `/api/auth/login` | Público | Retorna token JWT |
| `GET` | `/api/locais` | Público | Lista estabelecimentos |
| `POST` | `/api/locais` | Admin | Cadastra estabelecimento, informando `idusuario` de um usuário tipo `3` |
| `PATCH` | `/api/locais/:id` | Admin ou responsável dono | Edita os dados do estabelecimento |
| `GET` | `/api/avaliacoes/local/:localId` | Público | Lista somente avaliações aprovadas |
| `GET` | `/api/avaliacoes/analise` | Admin | Lista avaliações aguardando moderação |
| `POST` | `/api/avaliacoes` | Cliente | Cria avaliação com `idestabelecimento`, `idnota` (1 a 5) e `comentario` (3 a 2000 caracteres) |
| `PATCH` | `/api/avaliacoes/:id` | Cliente autor | Edita a própria avaliação |
| `PATCH` | `/api/avaliacoes/:id/moderar` | Admin | Define status `aprovado` ou `rejeitado` |
| `DELETE` | `/api/avaliacoes/:id` | Cliente autor ou admin | Exclui avaliação |

Uma nota `1` recebe status `sob_analise`; as demais começam como `aprovado`. Somente admins podem aprovar/rejeitar avaliações em análise, e a edição de uma avaliação em análise/rejeitada não altera seu status. Cada cliente pode avaliar um estabelecimento uma única vez. A média do estabelecimento considera somente avaliações aprovadas. A rota de cadastro de usuários também permanece disponível no caminho legado `/users`.
