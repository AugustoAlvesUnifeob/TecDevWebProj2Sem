//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const User = conn.define('users',{
    name:{
        type: DataTypes.STRING,
        required: true
    },
    email:{
        type: DataTypes.STRING,
        required: true
    },
    password:{
        type: DataTypes.STRING,
        required: true
    },
    tipo:{
        type: DataTypes.INTEGER,
        required: true
    },
})

module.exports = User