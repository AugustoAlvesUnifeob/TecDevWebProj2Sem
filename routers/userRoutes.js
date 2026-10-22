//requerer a biblioteca router do express
const route = require('express').Router()

const { validationResult } = require('express-validator')
//requerer o controller no UserController
const UserController = require('../controlers/userController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/userValidator')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')

//rotas
//register
route.post('/register',registerValidationRules(), validate, UserController.register)

//listar todos
route.get('/', verifyToken, UserController.listAll)

//login
route.post('/login', UserController.login)

//listar um usuario por id
route.get('/:id', UserController.getUserById)

//rota para editar usuario
route.patch('/edit/:id', UserController.editUser)

module.exports = route