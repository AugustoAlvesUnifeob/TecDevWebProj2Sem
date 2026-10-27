//requere o express
const express = require('express')
//instacia do express
const api = express()
//require cors
const cors = require('cors')
//requerer a conexão
const conn = require('./db/conn.js')
//requerer os Models
const User = require('./models/Users.js')
const Estabelecimento = require('./models/Estabelecimento.js')
const Avaliacao = require('./models/avaliacao.js')
//requer a rotas ros usuarios (user)
const userRoutes = require('./routers/userRoutes.js')
const estabelecimentoRoutes = require('./routers/estabelecimentoRoutes.js')
const avaliacaoRoutes = require('./routers/avaliacaoRoutes.js')

User.hasMany(Estabelecimento, {foreignKey: 'idusuario'})
Estabelecimento.belongsTo(User, {foreignKey: 'idusuario'})
User.hasMany(Avaliacao, {foreignKey: 'iduser'})
Avaliacao.belongsTo(User, {foreignKey: 'iduser'})
Estabelecimento.hasMany(Avaliacao, {foreignKey: 'idestabelecimento'})
Avaliacao.belongsTo(Estabelecimento, {foreignKey: 'idestabelecimento'})

//configurando JSON response
api.use(express.json())

//salve cors
api.use(cors({credentials: true, origin: 'http://localhost:5000'}))

api.use('/users',userRoutes)
api.use('/locais', estabelecimentoRoutes)
api.use('/avaliacoes', avaliacaoRoutes)

//start api
conn.sync({alter: true})
    .then(()=>{api.listen(5000)})
    .catch(error=>{console.error('Erro ao sincronizar o banco de dados:', error)})
