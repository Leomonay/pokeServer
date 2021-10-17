const { DataTypes } = require('sequelize');

function pokemon(sequelize){ 
    return sequelize.define(
        'pokemon', {
        id_pokemon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageFront:{
            type: DataTypes.STRING,
            allowNull: false,            
        },
        imageBack:{
            type: DataTypes.STRING,
            allowNull: false,            
        },
        imageIcon:{
            type: DataTypes.STRING,
            allowNull: false,            
        },
        height:{
            type: DataTypes.DOUBLE,
            allowNull: false,            
        },
        weight:{
            type: DataTypes.DOUBLE,
            allowNull: false,            
        },
        hp:{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        attack:{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        'special-attack':{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        defense:{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        'special-defense':{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
        speed:{
            type: DataTypes.INTEGER,
            allowNull: false,            
        },
    })
}

module.exports = {pokemon}