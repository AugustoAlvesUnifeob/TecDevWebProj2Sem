const route = require('express').Router()
const EstabelecimentoController = require('../controlers/estabelecimentoController')
const authorizeRoles = require('../helpers/authorize-roles')
const validate = require('../helpers/validation')
const {createValidationRules, updateValidationRules} = require('../helpers/estabelecimentoValidator')
const verifyToken = require('../helpers/verify-token')

//rotas
//listar todos os estabelecimentos
route.get('/', EstabelecimentoController.list)

//cadastrar estabelecimento
route.post('/register', verifyToken, authorizeRoles(3), createValidationRules(), validate, EstabelecimentoController.register)

//editar estabelecimento
route.patch('/:id', verifyToken, authorizeRoles(1, 3), updateValidationRules(), validate, EstabelecimentoController.update)

module.exports = route
