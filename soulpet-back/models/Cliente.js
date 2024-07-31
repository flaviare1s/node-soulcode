// Model para gerar a tabela de clientes no MySQL
// Cada propriedade representa uma coluna da tabela
// Primeiro precisamos importar a conexão com o banco de dados

import { connection } from '../config/database.js'
import { DataTypes } from 'sequelize' // importa os tipos de dados do sequelize
import { Endereco } from './Endereco.js'
import { Pet } from './Pet.js'

export const Cliente = connection.define('cliente', {
  nome: {
    type: DataTypes.STRING(130), // define com VARCHAR(130)
    allowNull: false, // define como NOT NULL
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
})

// Associação 1:1 (Cliente-Endereco)
// Cliente tem 1 Endereco
// Endereco ganha uma chave estrangeira
// Cascade indica que caso o cliente seja excluído, o endereço tbm será excluído
Cliente.hasOne(Endereco, { onDelete: 'CASCADE'})
Endereco.belongsTo(Cliente) // geral uma foreign key na talela enderecos

// Associação 1:N (Cliente-Pet)
// Cliente pode ter vários pets
Cliente.hasMany(Pet, { onDelete: 'CASCADE' })
Pet.belongsTo(Cliente) // gera uma foreign key para indicar o responsável




// Cliente tem funções para gerenciar a tabela de clientes

//Cliente.findAll() // Retorna todos os registros da tabela de clientes
//Cliente.findOne({ where: { id: id } }) // Retorna o registro de acordo ID
//Cliente.findById(id) // Retorna o registro de acordo ID
//Cliente.create(cliente) // Cria um novo registro
//Cliente.update(novos dados, { where: { id: id } }) // Atualiza um registro
//Cliente.destroy({ where: { id: id } }) // Deleta um registro
