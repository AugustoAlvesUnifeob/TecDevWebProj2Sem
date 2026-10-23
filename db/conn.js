//requer o sequelize
const Sequelize = require('sequelize')

//parametros de conexao
const conn = new Sequelize(
    'projeto2bimestre',
    'root',
    '',{
        host:'localhost',
        dialect:'mysql',
        port:3306
    }
)

module.exports = conn