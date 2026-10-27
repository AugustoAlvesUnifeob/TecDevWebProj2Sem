const {body} = require('express-validator')

const createValidationRules = () => [
    body('idestabelecimento').isInt({min: 1}).withMessage('Informe um estabelecimento válido'),
    body('idnota').isInt({min: 1, max: 5}).withMessage('A nota deve ser um número entre 1 e 5'),
    body('comentario').isString().trim().isLength({min: 3, max: 2000}).withMessage('O comentário deve ter entre 3 e 2000 caracteres')
]

const updateValidationRules = () => [
    body('idnota').optional().isInt({min: 1, max: 5}).withMessage('A nota deve ser um número entre 1 e 5'),
    body('comentario').optional().isString().trim().isLength({min: 3, max: 2000}).withMessage('O comentário deve ter entre 3 e 2000 caracteres')
]

const moderateValidationRules = () => [
    body('status')
        .isIn(['aprovado', 'rejeitado'])
        .withMessage('O status deve ser aprovado ou rejeitado')
]

module.exports = {
    createValidationRules,
    updateValidationRules,
    moderateValidationRules
}
