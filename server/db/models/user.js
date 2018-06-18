const Sequelize = require("sequelize")
const db = new Sequelize("postgres://localhost:5432/hapidb")

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
})

module.exports = {
  User,
  db,
}
