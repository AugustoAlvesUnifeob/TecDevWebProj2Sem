//requerer os models
const Estabelecimento = require('../models/Estabelecimento')

module.exports = class EstabelecimentoController{
    //metodo para listar todos os estabelecimentos
    static async list(req, res){
        try{
            const estabelecimentos = await Estabelecimento.findAll()
            return res.status(200).json({estabelecimentos})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao listar estabelecimentos'})
        }
    }

    //metodo para cadastrar um estabelecimento
    static async register(req, res){
        const {name, CNPJ, descricao, phone, horario} = req.body

        try{
            const estabelecimento = await Estabelecimento.create({
                name: name,
                CNPJ: CNPJ,
                descricao: descricao,
                phone: phone,
                horario: horario,
                idusuario: req.user.id
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

    //metodo para editar um estabelecimento
    static async update(req, res){
        const {name, CNPJ, descricao, phone, horario} = req.body

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

            if(name === undefined && CNPJ === undefined && descricao === undefined
                && phone === undefined && horario === undefined){
                return res.status(400).json({message: 'Informe ao menos um campo para atualizar'})
            }

            await estabelecimento.update({
                name: name || estabelecimento.name,
                CNPJ: CNPJ || estabelecimento.CNPJ,
                descricao: descricao || estabelecimento.descricao,
                phone: phone || estabelecimento.phone,
                horario: horario || estabelecimento.horario
            })
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
