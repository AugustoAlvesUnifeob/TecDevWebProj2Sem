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
//requer a rotas ros usuarios (user)
const userRoutes = require('./routers/userRoutes.js')

//configurando JSON response
api.use(express.json())

//salve cors
api.use(cors({credentials: true, origin: 'http://localhost:5000'}))

api.use('/users',userRoutes)

//start api
conn.sync()
    .then(()=>{api.listen(5000)})
    .catch(error=>{console.info(error)})
