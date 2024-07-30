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
Cliente.hasOne(Endereco)
Endereco.belongsTo(Cliente) // geral uma foreign key na talela enderecos

// Associação 1:N (Cliente-Pet)
// Cliente pode ter vários pets
Cliente.hasMany(Pet)
Pet.belongsTo(Cliente) // gera uma foreign key para indicar o responsável
