const route = require('express').Router()
const AvaliacaoController = require('../controlers/avaliacaoController')
const authorizeRoles = require('../helpers/authorize-roles')
const validate = require('../helpers/validation')
const {
    createValidationRules,
    updateValidationRules,
    moderateValidationRules
} = require('../helpers/avaliacaoValidator')
const verifyToken = require('../helpers/verify-token')

//rotas
//listar avaliações aprovadas de um estabelecimento
route.get('/local/:localId', AvaliacaoController.listByEstabelecimento)

//listar avaliações em análise
route.get('/analise', verifyToken, authorizeRoles(1), AvaliacaoController.listPending)

//cadastrar avaliação
route.post('/register', verifyToken, authorizeRoles(2), createValidationRules(), validate, AvaliacaoController.create)

//moderar avaliação
route.patch('/:id/moderar', verifyToken, authorizeRoles(1), moderateValidationRules(), validate, AvaliacaoController.moderate)

//editar avaliação
route.patch('/:id', verifyToken, authorizeRoles(2), updateValidationRules(), validate, AvaliacaoController.update)

//excluir avaliação
route.delete('/:id', verifyToken, authorizeRoles(1, 2), AvaliacaoController.remove)

module.exports = route
