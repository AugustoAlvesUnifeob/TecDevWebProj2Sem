//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model user
const User = conn.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {isEmail: true}
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {isIn: [[1, 2, 3]]}
    },
})

module.exports = User