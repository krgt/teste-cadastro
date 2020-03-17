const sequelize = require('../db/sequelize')
const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs')

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(256),
    allowNull: false
  }
}, {
  tableName: 'user',
  timestamps: false
})

User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
}

// User.beforeCreate(async (user, options) => {
//   user.password = await bcrypt.hash(user.password, 8)
// })

User.beforeSave(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 8)
})

User.findByCredentials = async (email, password) => {
  const userObj = await User.findOne({ where: { email } })

  if (!userObj) throw new Error('Bad credentials')

  console.log(userObj.password)

  const isMatch = await bcrypt.compare(password, userObj.password)
  console.log(isMatch)

  if (!isMatch) throw new Error('Bad credentials')

  return userObj
}

module.exports = User