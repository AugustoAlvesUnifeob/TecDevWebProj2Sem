require('dotenv').config()

//requerer a biblioteca jwt
const jwt = require('jsonwebtoken')

//criar o metodo para gerar o token
const createUserToken = async(User, req, res)=>{
    const token = jwt.sign({
        name: User.name,
        id: User.id,
        tipo: User.tipo
    }, process.env.CHAVETOKEN, {expiresIn: '1d'})

    //retornamos o token
    res.status(200).json({token:token})
}
module.exports = createUserToken