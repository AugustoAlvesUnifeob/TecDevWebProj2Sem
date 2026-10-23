const route = require('express').Router()
const {body} = require('express-validator')
const EstabelecimentoController = require('../controlers/estabelecimentoController')
const authorizeRoles = require('../helpers/authorize-roles')
const {validate} = require('../helpers/userValidator')
const verifyToken = require('../helpers/verify-token')

const createValidationRules = () => [
    body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
    body('CNPJ').trim().notEmpty().withMessage('O CNPJ é obrigatório'),
    body('descricao').trim().notEmpty().withMessage('A descrição é obrigatória'),
    body('phone').trim().notEmpty().withMessage('O telefone é obrigatório'),
    body('horario').trim().notEmpty().withMessage('O horário é obrigatório'),
    body('idusuario').isInt({min: 1}).withMessage('Informe o id do responsável')
]

const updateValidationRules = () => [
    body('name').optional().trim().notEmpty().withMessage('O nome não pode ser vazio'),
    body('CNPJ').optional().trim().notEmpty().withMessage('O CNPJ não pode ser vazio'),
    body('descricao').optional().trim().notEmpty().withMessage('A descrição não pode ser vazia'),
    body('phone').optional().trim().notEmpty().withMessage('O telefone não pode ser vazio'),
    body('horario').optional().trim().notEmpty().withMessage('O horário não pode ser vazio')
]

route.get('/', EstabelecimentoController.list)
route.post('/', verifyToken, authorizeRoles(1), createValidationRules(), validate, EstabelecimentoController.create)
route.patch('/:id', verifyToken, authorizeRoles(1, 3), updateValidationRules(), validate, EstabelecimentoController.update)

module.exports = route
