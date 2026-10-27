//requerer a biblioteca router do express
const route = require('express').Router()

//requerer o controller no UserController
const UserController = require('../controlers/userController')
//requerer as validacoes
const {registerValidationRules, updateValidationRules} = require('../helpers/userValidator')
const validate = require('../helpers/validation')
//requerer a validação do token
const verifyToken = require('../helpers/verify-token.js')
const authorizeRoles = require('../helpers/authorize-roles')

//rotas
//register
route.post('/register',registerValidationRules(), validate, UserController.register)

//listar todos
route.get('/', verifyToken, authorizeRoles(1), UserController.listAll)

//login
route.post('/login', UserController.login)

//listar um usuario por id
route.get('/:id', verifyToken, UserController.getUserById)

//rota para editar usuario
route.patch('/edit/:id', verifyToken, updateValidationRules(), validate, UserController.editUser)

module.exports = route