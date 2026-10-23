//requerer o model do usuario
const User = require('../models/Users')

//requerer serviço para gerar token
const createUserToken = require('../helpers/create-user-token')

//requerer biblioteca bcrypt
const bcrypt = require('bcrypt')

module.exports = class UserController{
    static async register(req, res){
        const {name, email, password, tipo} = req.body

        try{
            const userExists = await User.findOne({where:{email: email}})
            if(userExists){
                return res.status(422).json({message: 'Usuário já cadastrado, utilize outro e-mail'})
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            await User.create({
                name: name,
                email: email,
                password: passwordHash,
                tipo: Number(tipo)
            })
            return res.status(201).json({message: 'Usuário cadastrado com sucesso'})
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(422).json({message: 'Usuário já cadastrado, utilize outro e-mail'})
            }
            console.error(error)
            return res.status(500).json({message: 'Erro ao cadastrar usuário'})
        }
    }

    //metodo para listar todos os usuarios
    static async listAll(req, res){
        try{
            const users = await User.findAll({attributes: {exclude: ['password']}})
            return res.status(200).json({users: users})
        }
        catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao listar usuários'})
        }
    }

    //metodo para listar um unico usuario
    static async getUserById(req, res){
        //receber por parametro o id
        const id = req.params.id

        try{
            const user = await User.findByPk(id, {attributes: {exclude: ['password']}})
            if(!user){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }
            if(Number(req.user.tipo) !== 1 && Number(req.user.id) !== user.id){
                return res.status(403).json({message: 'Você só pode consultar seus próprios dados'})
            }
            return res.status(200).json({user})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao consultar usuário'})
        }
    }

    //criar metodo de login
    static async login(req, res){
        //requerer pelo body os parametros
        const {email, password} = req.body

        //verificar se o usuario existe
        try{
            const user = await User.findOne({where:{email:email}})
            if(!user){
                return res.status(422).json({message: 'Não há usuário cadastrado com esse e-mail'})
            }

            const checkPassword = await bcrypt.compare(password, user.password)
            if(!checkPassword){
                return res.status(422).json({message: 'Senha inválida'})
            }

            return await createUserToken(user, req, res)
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao autenticar usuário'})
        }
    }

    //editar dados do usuário
    static async editUser(req, res){
        //recuperar o id a ser alterado
        const id = req.params.id

        //recuperar os dados do corpo da requisição pelo body
        const {name, email} = req.body

        try{
            const user = await User.findByPk(id)
            if(!user){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }

            if(Number(req.user.tipo) !== 1 && Number(req.user.id) !== user.id){
                return res.status(403).json({message: 'Você só pode editar seus próprios dados'})
            }

            if(email && email !== user.email){
                const emailExists = await User.findOne({where: {email}})
                if(emailExists){
                    return res.status(422).json({message: 'E-mail já cadastrado'})
                }
            }

            await user.update({name: name || user.name, email: email || user.email})
            return res.status(200).json({message: 'Usuário alterado com sucesso'})
        }
        catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(422).json({message: 'E-mail já cadastrado'})
            }
            console.error(error)
            return res.status(500).json({message: 'Erro ao editar o usuário'})
        }
    }
}