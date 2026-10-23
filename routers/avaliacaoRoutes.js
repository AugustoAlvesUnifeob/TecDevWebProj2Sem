const route = require('express').Router()
const {body} = require('express-validator')
const AvaliacaoController = require('../controlers/avaliacaoController')
const authorizeRoles = require('../helpers/authorize-roles')
const {validate} = require('../helpers/userValidator')
const verifyToken = require('../helpers/verify-token')

const createValidationRules = () => [
    body('idestabelecimento').isInt({min: 1}).withMessage('Informe um estabelecimento válido'),
    body('idnota').isInt({min: 1, max: 5}).withMessage('A nota deve ser um número entre 1 e 5'),
    body('comentario').isString().trim().isLength({min: 3, max: 2000}).withMessage('O comentário deve ter entre 3 e 2000 caracteres')
]

const updateValidationRules = () => [
    body('idnota').optional().isInt({min: 1, max: 5}).withMessage('A nota deve ser um número entre 1 e 5'),
    body('comentario').optional().isString().trim().isLength({min: 3, max: 2000}).withMessage('O comentário deve ter entre 3 e 2000 caracteres')
]

route.get('/local/:localId', AvaliacaoController.listByEstabelecimento)
route.get('/analise', verifyToken, authorizeRoles(1), AvaliacaoController.listPending)
route.post('/', verifyToken, authorizeRoles(2), createValidationRules(), validate, AvaliacaoController.create)
route.patch('/:id/moderar', verifyToken, authorizeRoles(1), AvaliacaoController.moderate)
route.patch('/:id', verifyToken, authorizeRoles(2), updateValidationRules(), validate, AvaliacaoController.update)
route.delete('/:id', verifyToken, authorizeRoles(1, 2), AvaliacaoController.remove)

module.exports = route
