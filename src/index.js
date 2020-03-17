require('dotenv').config()
const express = require('express')
const routers = require('./routers')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

const sequelize = require('./db/sequelize')
const models = require('./models') // load models before sync
sequelize.sync({ force: false })

app.use(express.json())
app.use(routers.userRouter)

app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})