//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model estabelecimento
const Estabelecimento = conn.define('estabelecimentos',{
    name:{
        type: DataTypes.STRING,
        required: true
    },
    CNPJ:{
        type: DataTypes.STRING,
        required: true
    },
    descricao:{
        type: DataTypes.STRING,
        required: true
    },
    phone:{
        type: DataTypes.INTEGER,
        required: true
    },
    horario:{
        type: DataTypes.STRING,
        required: true
    },
    idusuario:{
        type: DataTypes.INTEGER
    },
    media:{
        type: DataTypes.INTEGER
    }
})

module.exports = Estabelecimento