///requerer as bibliotecas do validator
const {body,validationResult} = require('express-validator')

//validações
const registerValidationRules = ()=>{
    return [
        body('name').notEmpty().withMessage('O nome é obrigatorio'),    
        body('email').notEmpty().withMessage('O email é obrigatorio e deve ser válido'),
        body('password').notEmpty().withMessage('A senha é obrigatoria'),
        body('tipo').notEmpty().withMessage('O tipo é obrigatorio'),            
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