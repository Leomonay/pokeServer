const { Sequelize } = require('sequelize');
const {
  ALT_DB_URL
} = process.env;
const {pokemon} = require ('./models/pokemon')
const types = require ('./models/types')

const sequelize = new Sequelize(ALT_DB_URL, {
  logging: false,
  native: false
});

pokemon(sequelize)
types(sequelize)

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

const{Pokemon, Type}=sequelize.models

Pokemon.belongsToMany(Type,  {through: 'pokemontypes'})
Type.belongsToMany(Pokemon,  {through: 'pokemontypes'})

module.exports = {...sequelize.models, conn: sequelize}