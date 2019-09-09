/*  eslint-disable no-console */

const client = require('../utils/client');

client.query(`
  CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    type TEXT NOT NULL,
  )
`)
  .then(
    () => console.log('create tables complete'),
    err => console.log(err)
  )
  .then(() => {
    client.end();
  });
 
