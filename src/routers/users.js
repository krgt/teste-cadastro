const express = require('express')
const HttpCodes = require('http-status-codes')
const { User } = require('../models/')

const router = new express.Router()

const getAttributesFromReq = req => ({
  name: req.name,
  phone: req.phone,
  birthday: req.birthday,
  password: req.password,
  cpf: req.cpf,
  email: req.email
})

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(getAttributesFromReq(req.body))
    res.status(HttpCodes.CREATED).json({})
  } catch (e) {
    console.log(e)
    res.status(HttpCodes.BAD_REQUEST).send({error: e.errors[0].message})
  }
})

router.get('/users', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    const offset = req.query.offset ? parseInt(req.query.offset) : null
    const page = offset/limit

    const { count, rows } = await User.findAndCountAll({ limit, offset })
    res.status(HttpCodes.OK).json({ page, count, data: rows })
  } catch (e) {
    console.log(e)
    res.status(HttpCodes.BAD_REQUEST).send({error: e.errors[0].message})
  }
})

router.delete('/users', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    await user.destroy()
    res.status(HttpCodes.OK).json({})
  } catch (e) {
    console.log(e)
    res.status(HttpCodes.BAD_REQUEST).send({error: e.message || 'Erro'})
  }
})

router.patch('/users', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.currentEmail, req.body.currentPassword)
    const newAttributes = getAttributesFromReq(req.body) // filter only useful attributes

    Object.keys(newAttributes).forEach( key => user[key] = newAttributes[key] )
    user.save()

    res.status(HttpCodes.OK).json({})
  } catch (e) {
    console.log(e)
    res.status(HttpCodes.BAD_REQUEST).send({error: e.message || 'Erro'})
  }
})

module.exports = router