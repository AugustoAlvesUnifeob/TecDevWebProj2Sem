//requerer somente o metodo datatypes do sequelize
const {DataTypes} = require('sequelize')
//requerer a conexão
const conn = require('../db/conn.js')

//definir o model da avaliação
const Avaliacao = conn.define('avaliacoes',{
    iduser:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idestabelecimento:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idnota:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {min: 1, max: 5}
    },
    comentario:{
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {len: [3, 2000]}
    },
    status:{
        type: DataTypes.ENUM('sob_analise', 'aprovado', 'rejeitado'),
        allowNull: false,
        defaultValue: 'aprovado'
    }
}, {
    indexes: [{
        unique: true,
        fields: ['iduser', 'idestabelecimento']
    }]
})

module.exports = Avaliacao
