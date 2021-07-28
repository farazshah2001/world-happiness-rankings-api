// Update with your config settings.
require('dotenv').config();
module.exports = {

 

  development: {
    client: 'mysql2',
    connection: {
      database: process.env.database,
      user:     process.env.user,
      password: process.env.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: process.env.database,
      user:     process.env.user,
      password: process.env.password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
// database: 'happiness',
// user:     'root',
// password: 'Lumbarjack@35'