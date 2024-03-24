const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_ice_cream_shop_db')
const app = express()

app.use(require('morgan')('dev'))
app.use(express.json())

app.post('/api/flavors', async(req, res, next) => {
  try {
      const SQL = /* sql */ `
      INSERT INTO flavor(name)
      VALUES($1)
      RETURNING *      
      `;
      const response  = await client.query(SQL, [req.body.txt])
      res.send(response.rows[0])
  } catch (error) {
      next(error)
  }
})

app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = /* sql */ `
    SELECT * from flavor;    
    `;
  } catch(error) {
    next(error)
  }

});

app.get('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = /* sql */ `
    SELECT from flavor;
    WHERE id=$2    
    `;
  } catch(error) {
    next(error)
  }

});

app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = /* sql */ `
    UPDATE flavor
    SET name=$1, ranking=$2, updated_at= now()
    WHERE id=$3    
    `;
    const response = await client.query(SQL, [req.body.txt, req.body.ranking, req.params.id])
    res.send(response.rows[0]);

  } catch(error) {
    next(error)
  }

});

app.delete('/api/flavors/:id', async (req, res, next) => {
try {
  const SQL = `
   DELETE from flavor
   WHERE id=$1
  `;
  const response = await client.query(SQL, [req.params.id])
  res.sendStatus(204);
} catch (error) {
  next (error)
}

});


const init = async () => {
  await client.connect()
  console.log('connected to database')
  let SQL = /* sql */`
  DROP TABLE IF EXISTS flavors;
  CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    create_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    ranking INTEGER DEFAULT 3 NOT NULL,
    name VARCHAR(55)
  )
  `;
await client.query(SQL);
console.log("tables created");

SQL = /* sql */ `
INSERT INTO flavors(name, ranking) VALUES('Strawberry', 5);
INSERT INTO flavors(name, ranking) VALUES('Chocolate', 4);
INSERT INTO flavors(name, ranking) VALUES('Vanilla', 2);
`;
await client.query(SQL);
console.log('DATA SEEDED')

  const port = process.env.Port || 3001
  app.listen(port, () => console.log(`listening on port${port}`));
};
init()


