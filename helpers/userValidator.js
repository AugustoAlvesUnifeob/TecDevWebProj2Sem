///requerer as bibliotecas do validator
const {body} = require('express-validator')

//validações
const registerValidationRules = ()=>{
    return [
        body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
        body('email').trim().isEmail().withMessage('Informe um e-mail válido'),
        body('password').isString().isLength({min: 8}).withMessage('A senha deve ter pelo menos 8 caracteres'),
        body('tipo').isInt({min: 1, max: 3}).withMessage('O tipo deve ser 1 (administrador), 2 (cliente) ou 3 (estabelecimento)'),
    ]
}

const updateValidationRules = () => [
    body('name').optional().trim().notEmpty().withMessage('O nome não pode ser vazio'),
    body('email').optional().trim().isEmail().withMessage('Informe um e-mail válido')
]

module.exports = {
    registerValidationRules,
    updateValidationRules
}