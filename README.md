# pokeServer

The project is a server for a pokedex project.

The stack used in this project is express, sequelize and postgreSQL 

- [ ] __GET /pokemons__:
  - Get a Pokemon list with the first 12 pokemon from pokeapi
  - It must return just necessary data for principal route (name, icon, types)

- [ ] __GET /pokemons/{idPokemon}__:
  - Get the a particular pokemon detail
  - It must return just necessary data for pokemon Detail page (all except bigImage)
  - It must work for both a pokeapi pokemon ID or a created one.

- [ ] __GET /pokemons?name="..."__:
  - Get the pokemon that matches exactly with the name sent as query parameter (from both pokeapi or created)
  - If no such a pokemon exists, show an appropriate message

- [ ] __POST /pokemons__:
  - Gets the data received from Creation page.
  - Creates a pokemon in server database.

- [ ] __GET /types__:
  - Obtaion all existent pokemon types
  - In a first instance, it should get them from pokeapi, save them in server database and then, be sent to frontend when requested.