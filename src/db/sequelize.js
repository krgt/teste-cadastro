const Sequelize = require('sequelize')

console.log('link: ', process.env.DB_HOST)

const sequelize = new Sequelize(process.env.DB_HOST, {
  dialect:  'postgres',
  protocol: 'postgres',
  logging:  true //false
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize