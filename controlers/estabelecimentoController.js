const Estabelecimento = require('../models/Estabelecimento')
const User = require('../models/Users')

const editableFields = ['name', 'CNPJ', 'descricao', 'phone', 'horario']

const getEditableData = (body) => Object.fromEntries(
    editableFields
        .filter((field) => body[field] !== undefined)
        .map((field) => [field, body[field]])
)

module.exports = class EstabelecimentoController {
    static async list(req, res){
        try{
            const estabelecimentos = await Estabelecimento.findAll()
            return res.status(200).json({estabelecimentos})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao listar estabelecimentos'})
        }
    }

    static async create(req, res){
        const {idusuario} = req.body

        try{
            const responsavel = await User.findOne({
                where: {id: idusuario, tipo: 3}
            })
            if(!responsavel){
                return res.status(400).json({message: 'Informe um usuário do tipo estabelecimento válido'})
            }

            const estabelecimento = await Estabelecimento.create({
                ...getEditableData(req.body),
                idusuario: responsavel.id
            })
            return res.status(201).json({estabelecimento})
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(409).json({message: 'Já existe um estabelecimento com esse CNPJ'})
            }
            console.error(error)
            return res.status(500).json({message: 'Erro ao cadastrar estabelecimento'})
        }
    }

    static async update(req, res){
        try{
            const estabelecimento = await Estabelecimento.findByPk(req.params.id)
            if(!estabelecimento){
                return res.status(404).json({message: 'Estabelecimento não encontrado'})
            }

            const isAdmin = Number(req.user.tipo) === 1
            const isOwner = Number(req.user.tipo) === 3
                && Number(req.user.id) === Number(estabelecimento.idusuario)
            if(!isAdmin && !isOwner){
                return res.status(403).json({message: 'Você só pode editar seu próprio estabelecimento'})
            }

            const data = getEditableData(req.body)
            if(Object.keys(data).length === 0){
                return res.status(400).json({message: 'Informe ao menos um campo para atualizar'})
            }

            await estabelecimento.update(data)
            return res.status(200).json({estabelecimento})
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(409).json({message: 'Já existe um estabelecimento com esse CNPJ'})
            }
            console.error(error)
            return res.status(500).json({message: 'Erro ao editar estabelecimento'})
        }
    }
}
