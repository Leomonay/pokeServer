# pokeServer

The project is a server for a pokedex project.

The stack used in this project is express, sequelize and postgreSQL 

### server.get('/pokemon/:id')
Gets a pokemon by id number. For pokemon Created in Lab the id is starts width an A before the number. It is used to get each pokemon card.
### server.get('/pokemon/byname?name={name}')
Gets a pokemon by name. It is used to send a request from searchBar.
### server.get('/totalpokemon',getTotalPokemon)
The total quantity of pokemon in both sources in order to set the number of pages in frontEnd
### server.get('/types',sendTypes)
Gets the types list from pokeapi and saves it in database
### server.post('/pokemon',createPokemon)Server for Pokedex Api
Creates a new pokemon from frontEnd form and saves in database.
