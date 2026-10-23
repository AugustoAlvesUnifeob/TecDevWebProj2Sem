//requerer a biblioteca router do express
const route = require('express').Router()
const {body} = require('express-validator')

//requerer o controller no UserController
const UserController = require('../controlers/userController')
//requerer as validacoes
const {registerValidationRules, validate} = require('../helpers/userValidator')
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
route.patch('/edit/:id', verifyToken, [
    body('name').optional().trim().notEmpty().withMessage('O nome não pode ser vazio'),
    body('email').optional().trim().isEmail().withMessage('Informe um e-mail válido')
], validate, UserController.editUser)

module.exports = route