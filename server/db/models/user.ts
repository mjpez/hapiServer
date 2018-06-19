import Sequelize from "sequelize"

const db = new Sequelize("postgres://localhost:5432/hapidb")

export interface UserModel {
  name?: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

const User = db.define<UserModel, UserModel>("user", {
  name: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
})

export { User, db }
