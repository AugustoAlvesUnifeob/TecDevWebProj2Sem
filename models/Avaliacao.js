//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const User = conn.define('users',{
    iduser:{
        type: DataTypes.INTEGER,
        required: true
    },
    idestabelecimento:{
        type: DataTypes.INTEGER,
        required: true
    },
    idnota:{
        type: DataTypes.INTEGER,
        required: true
    },
    emanalise:{
        type: DataTypes.INTEGER,
        required: true
    },
})

module.exports = User