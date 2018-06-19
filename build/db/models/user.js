"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const db = new sequelize_1.default("postgres://localhost:5432/hapidb");
exports.db = db;
const User = db.define("user", {
    name: {
        type: sequelize_1.default.STRING,
    },
    password: {
        type: sequelize_1.default.STRING,
    },
});
exports.User = User;
