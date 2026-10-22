//requerer o model do usuario
const User = require('../models/Users')

//requerer serviço para gerar token
const createUserToken = require('../helpers/create-user-token')

//requerer biblioteca bcrypt
const bcrypt = require('bcrypt')

module.exports = class UserController{
    static async register(req, res){
        const {name, email, password, tipo} = req.body

        //verificar se o usuario ja existe
        const userExists = await User.findOne({where:{email: email}})
        if(userExists){
            res.status(422).json({
                message: "Usuario já cadastrado, utilize outro e-mail"
            })
        }

        //criptografar senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //criar novo usuario
        try{
            await User.create({
                name: name,
                email: email,
                password: passwordHash,
                tipo: tipo
            })
            res.status(200).json({message:'Usuario Cadastrado com sucesso'})
        }catch(error){
            res.status(500).json({message: error})
        }
    }

    //metodo para listar todos os usuarios
    static async listAll(req, res){
        try{
            const users = await User.findAll()
            res.status(200).json({users:users})
        }
        catch(error){
            res.status(500).json({error: error})
        }
    }

    //metodo para listar um unico usuario
    static async getUserById(req, res){
        //receber por parametro o id
        const id = req.params.id

        //verificar se o usuario existe
        const user = await findOne(id)

        //caso o usuario não exista
        if(!user){
            res.status(422).json({message: "usuário não encontrado"})
            return
        }

        //retornamos o usuario
        res.status(200).json({
            user
        })
    }

    //criar metodo de login
    static async login(req, res){
        //requerer pelo body os parametros
        const {email, password} = req.body

        //verificar se o usuario existe
        const user = await User.findOne({where:{email:email}})

        if(!user){
            res.status(422).json({
                message:"Não há usuário cadastrado com esse e-mail"
            })
            return
        }

        //verificar password
        const checkPassword = await bcrypt.compare(password, user.password)

        //retornar mensagem para senha incorreta
        if(!checkPassword){
            res.status(422).json({
                message: "Senha Invalida"
            })
            return
        }

        //geramos o token para o usuario
        await createUserToken(user, req, res)
    }

    //editar dados do usuário
    static async editUser(req, res){
        //recuperar o id a ser alterado
        const id = req.params.id

        //recuperar os dados do corpo da requisição pelo body
        const {name, email} = req.body

        //verificar se o usuario existe
        const user = await User.findByPk(id)

        //caso o usuario não exista
        if(!user){
            res.status(422).json({message: 'Usuário não encontrado'})
            return
        }

        //alterar os dados
        try{
            await User.update({
                name:name,
                email:email
            },{where:{id:id}})
            res.status(200).json({message: 'Usuario alterado com sucesso'})
        }
        catch(error){
            res.status(401).json({message: 'Erro ao editar o usuario'})
            return
        }
    }
}