//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model estabelecimento
const Estabelecimento = conn.define('estabelecimentos',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CNPJ:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descricao:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    horario:{
        type: DataTypes.STRING,
        allowNull: false
    },
    idusuario:{
        type: DataTypes.INTEGER
    },
    media:{
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true
    }
})

module.exports = Estabelecimento