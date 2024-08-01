import { Cliente } from '../models/Cliente.js'
import { Endereco } from '../models/Endereco.js'
import { Router } from 'express'

export const clientesRouter = Router()

// CRUD CLIENTES: Create, Read, Update, Delete
// CREATE:
clientesRouter.post('/clientes', async (req, res) => {
  // Extração de dados do corpo da requisição (enviados pelo usuário)
  const { nome, email, telefone, endereco } = req.body
  
  try {
    // Tentativa de criação de um novo cliente
    await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }, // Inclui o model endereco na requisição
    )
    res.json({ message: 'Cliente criado com sucesso!' })
  } catch(err) {
    // Tratamento caso ocorra um erro
    // 500 = INTERNAL SERVER ERROR
    res.status(500).json({ message: 'Erro ao criar cliente!' })
  }
})

// READ:
// Listagem de todos os clientes
clientesRouter.get('/clientes', async (req, res) => {
  const listaClientes = await Cliente.findAll() // = SELECT * FROM cliente
  res.json(listaClientes) // resposta em JSON
})

// Listagem de um cliente específico (ID = ?)
// :id = parâmetro de rota
clientesRouter.get('/clientes/:id', async (req, res) => {
  const cliente = await Cliente.findOne({
    where: { id: req.params.id }, // = SELECT * FROM cliente WHERE id = ?
    include: [Endereco] // juntar os dados do cliente com seu endereco (JOIN)
  }) 
  if(cliente) {
    res.json(cliente)
  } else {
    res.status(404).json({ message: 'Cliente não encontrado!' })
  }
})

// UPDATE:
clientesRouter.put('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id
  const { nome, email, telefone, endereco } = req.body

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } })
    if(cliente) {
      // Atualiza a linha de endereco onde o id do cliente for igual à chave estrangeira na tabela de endereços
      await Endereco.update(endereco, { where: { clienteId: idCliente } })
      await cliente.update( { nome, email, telefone })
      res.json({ message: 'Cliente atualizado com sucesso!' })
    } else {
      //404
      res.status(404).json({ message: 'Cliente não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao atualizar cliente!' })
  }
})

// DELETE:
clientesRouter.delete('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id
  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente }})

    if(cliente) {
      await cliente.destroy()
      res.json({ message: 'Cliente removido com sucesso!' })
    } else {
      res.status(404).json({ message: 'Cliente não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao remover cliente!' })
  }
})
