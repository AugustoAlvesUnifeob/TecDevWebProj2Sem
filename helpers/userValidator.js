///requerer as bibliotecas do validator
const {body, validationResult} = require('express-validator')

//validações
const registerValidationRules = ()=>{
    return [
        body('name').trim().notEmpty().withMessage('O nome é obrigatório'),
        body('email').trim().isEmail().withMessage('Informe um e-mail válido'),
        body('password').isString().isLength({min: 8}).withMessage('A senha deve ter pelo menos 8 caracteres'),
        body('tipo').isInt({min: 2, max: 3}).withMessage('O tipo deve ser 2 (cliente) ou 3 (estabelecimento)'),
    ]
}

//validação

const validate = (req, res, next) => {
    const erros = validationResult(req)
    if(erros.isEmpty()){
        return next()
    }
    //retornar o primeiro erro encontrado
    return res.status(422).json({message: erros.array()[0].msg})
}

module.exports = {
    registerValidationRules,
    validate
}