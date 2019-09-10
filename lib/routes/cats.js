const { Router } = require('express');
const client = require('../utils/client');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { owner, name, type } = req.body;
  
    client.query(`
    INSERT INTO cats (owner, name, type)
    VALUES ($1, $2, $3)
    RETURNING 
      id, owner, name, type;
  `,
    [owner, name, type]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    client.query(`
    SELECT id, owner, name, type
    FROM cats
    WHERE id = $1;
    `, [req.params.id]
    )
      .then(result => {
        const note = result.rows[0];
        if(!note) {
          throw {
            status: 404,
            message: `Id ${req.params.id} does not exist`
          };
        }
        res.send(note);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    client.query(`
      SELECT id, owner, name, type
      FROM cats
    `)
      .then(result => {
        res.send(result.rows);
      })
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { owner, name } = req.body;

    client.query(`
      UPDATE cats
        SET owner = $1, name = $2
      WHERE id = $3
      RETURNING id, owner, name, type
    `, [owner, name, req.params.id]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    client.query(`
      DELETE FROM cats
      WHERE id = $1
      RETURNING id, owner, name, type
    `, [req.params.id]
    )
      .then(result => {
        res.send(result.rows[0]);
      })
      .catch(next);
  });

