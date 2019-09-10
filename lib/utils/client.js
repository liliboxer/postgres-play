/*  eslint-disable no-console */
// make sure .env has been loaded
require('dotenv').config();
// 'require' png after npm i pg
const pg = require('pg');
// use pg Client
const Client = pg.Client;

const DATABASE_URL = process.env.DATABASE_URL;

const client = new Client(DATABASE_URL);

client.connect()
  .then(() => console.log('connected to db', DATABASE_URL))
  .catch(err => console.error('connection error', err));

client.on('error', err => {

  console.error('\n**** DATABASE ERROR ****\n\n', err);
});

module.exports = client;
