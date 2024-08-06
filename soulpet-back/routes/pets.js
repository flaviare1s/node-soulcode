import { Cliente } from '../models/Cliente.js'
import { Pet } from '../models/Pet.js'
import { Router } from 'express'

export const petsRouter = Router()


// CRUD PETS:
// CREATE:
petsRouter.post('/pets', async (req, res) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body

  try {
    const cliente = await Cliente.findByPk(clienteId)

    if (cliente) {
      await Pet.create({ nome, tipo, porte, dataNasc, clienteId })
      res.json({ message: 'Pet criado com sucesso!' })
    } else {
      res.status(404).json({ message: 'Cliente não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao criar pet!' })
  }
})

//READ:
petsRouter.get('/pets', async (req, res) => {
  const listaPets = await Pet.findAll({
    include: [{model: Cliente, attributes: ['id', ['nome', 'nomeCliente']]}]
  })
  res.json(listaPets)
})


petsRouter.get('/pets/:id', async (req, res) => {
  const pet = await Pet.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [{model: Cliente, attributes: ['id', ['nome', 'nomeCliente']]}]
    // include: [{ model: Cliente, attributes: {exclude: ["senha"]} }] --- caso quisesse excluir um campo
  })
  if (pet) {
    res.json(pet)
  } else {
    res.status(404).json({ message: 'Pet não encontrado!' })
  }
})

// UPDATE:
petsRouter.put('/pets/:id', async (req, res) => {
  const { nome, tipo, porte, dataNasc } = req.body

  try {
    const pet = await Pet.findOne({where: { id: req.params.id }})
    if (pet) {
      await pet.update({ nome, tipo, porte, dataNasc })
      res.json({ message: 'Pet atualizado com sucesso!' })
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' })
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: 'Erro ao atualizar pet!' })
  }
})

// DELETE:
petsRouter.delete('/pets/:id', async (req, res) => {
  try {
    const pet = await Pet.findByPk(req.params.id)
    if (pet) {
      await pet.destroy()
      res.json({ message: 'Pet removido com sucesso!' })
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' })
    }
  } catch(err) {
    res.status(500).json({ message: 'Erro ao remover pet!' })
  }
})
