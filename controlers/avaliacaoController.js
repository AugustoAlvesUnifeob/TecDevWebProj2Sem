const {fn, col} = require('sequelize')
const Avaliacao = require('../models/avaliacao')
const Estabelecimento = require('../models/Estabelecimento')

const updateMedia = async (idestabelecimento) => {
    const result = await Avaliacao.findOne({
        attributes: [[fn('AVG', col('idnota')), 'media']],
        where: {idestabelecimento, status: 'aprovado'},
        raw: true
    })
    await Estabelecimento.update(
        {media: result.media},
        {where: {id: idestabelecimento}}
    )
}

module.exports = class AvaliacaoController{
    //metodo para listar as avaliações aprovadas de um estabelecimento
    static async listByEstabelecimento(req, res){
        try{
            const estabelecimento = await Estabelecimento.findByPk(req.params.localId)
            if(!estabelecimento){
                return res.status(404).json({message: 'Estabelecimento não encontrado'})
            }

            const avaliacoes = await Avaliacao.findAll({
                where: {
                    idestabelecimento: estabelecimento.id,
                    status: 'aprovado'
                }
            })
            return res.status(200).json({avaliacoes})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao listar avaliações'})
        }
    }

    //metodo para listar avaliações em análise
    static async listPending(req, res){
        try{
            const avaliacoes = await Avaliacao.findAll({
                where: {status: 'sob_analise'}
            })
            return res.status(200).json({avaliacoes})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao listar avaliações em análise'})
        }
    }

    //metodo para cadastrar uma avaliação
    static async create(req, res){
        const {idestabelecimento, idnota, comentario} = req.body

        try{
            const estabelecimento = await Estabelecimento.findByPk(idestabelecimento)
            if(!estabelecimento){
                return res.status(404).json({message: 'Estabelecimento não encontrado'})
            }

            const existingReview = await Avaliacao.findOne({
                where: {iduser: req.user.id, idestabelecimento}
            })
            if(existingReview){
                return res.status(400).json({message: 'Você já avaliou este estabelecimento'})
            }

            const avaliacao = await Avaliacao.create({
                iduser: req.user.id,
                idestabelecimento,
                idnota,
                comentario,
                status: 'sob_analise'
            })
            if(avaliacao.status === 'aprovado'){
                await updateMedia(idestabelecimento)
            }
            return res.status(201).json({avaliacao})
        }catch(error){
            if(error.name === 'SequelizeUniqueConstraintError'){
                return res.status(400).json({message: 'Você já avaliou este estabelecimento'})
            }
            console.error(error)
            return res.status(500).json({message: 'Erro ao criar avaliação'})
        }
    }

    //metodo para editar uma avaliação
    static async update(req, res){
        try{
            const avaliacao = await Avaliacao.findByPk(req.params.id)
            if(!avaliacao){
                return res.status(404).json({message: 'Avaliação não encontrada'})
            }
            if(Number(req.user.id) !== Number(avaliacao.iduser)){
                return res.status(403).json({message: 'Você só pode editar sua própria avaliação'})
            }

            const idnota = req.body.idnota === undefined ? avaliacao.idnota : Number(req.body.idnota)
            const comentario = req.body.comentario === undefined ? avaliacao.comentario : req.body.comentario
            const status = avaliacao.status === 'aprovado' && idnota === 1
                ? 'sob_analise'
                : avaliacao.status
            await avaliacao.update({
                idnota,
                comentario,
                status
            })
            await updateMedia(avaliacao.idestabelecimento)
            return res.status(200).json({avaliacao})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao editar avaliação'})
        }
    }

    //metodo para moderar uma avaliação
    static async moderate(req, res){
        const {status} = req.body

        try{
            const avaliacao = await Avaliacao.findByPk(req.params.id)
            if(!avaliacao){
                return res.status(404).json({message: 'Avaliação não encontrada'})
            }

            await avaliacao.update({status})
            await updateMedia(avaliacao.idestabelecimento)
            return res.status(200).json({avaliacao})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao moderar avaliação'})
        }
    }

    //metodo para excluir uma avaliação
    static async remove(req, res){
        try{
            const avaliacao = await Avaliacao.findByPk(req.params.id)
            if(!avaliacao){
                return res.status(404).json({message: 'Avaliação não encontrada'})
            }

            const isAdmin = Number(req.user.tipo) === 1
            const isOwner = Number(req.user.id) === Number(avaliacao.iduser)
            if(!isAdmin && !isOwner){
                return res.status(403).json({message: 'Você só pode excluir sua própria avaliação'})
            }

            const idestabelecimento = avaliacao.idestabelecimento
            await avaliacao.destroy()
            await updateMedia(idestabelecimento)
            return res.status(200).json({message: 'Avaliação excluída com sucesso'})
        }catch(error){
            console.error(error)
            return res.status(500).json({message: 'Erro ao excluir avaliação'})
        }
    }
}
