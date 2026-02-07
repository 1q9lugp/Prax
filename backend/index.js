import express from 'express'; 
import products from './products.json' with { type: 'json' };
import cors from 'cors';
import crypto from 'crypto';
import { Pool } from 'pg';
import {prisma} from './orm.js';


const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', 
  optionsSuccessStatus: 200 
};

app.use(cors());
app.use(express.json()); 

const port = 3333;
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users)


})

app.get('/produkty', (req, res) => {
  res.json(products) 
})

app.post('/produkty', (req, res) => {
  const { category, name, price, image, description } = req.body;

  if (!category || !name || !price || !description) {
    return res.status(400).json({ error: 'All fields are required: category, name, price, description' });
  }

  const newProduct = {
    id: crypto.randomUUID(),
    name,
    category,
    price,
    image: image || '',
    description
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/produkty/:id', (req, res) => {
  const { id } = req.params;
  const { category, name, price, image, description } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = {
    ...products[productIndex],
    category: category || products[productIndex].category,
    name: name || products[productIndex].name,
    price: price || products[productIndex].price,
    image: image || products[productIndex].image,
    description: description || products[productIndex].description
  };

  products[productIndex] = updatedProduct;
  res.json(updatedProduct);
});

app.delete('/produkty/:id', (req, res) => {
  const { id } = req.params;

  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).send();
});

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'user', // From docker-compose.yml
  host: 'localhost', // Connecting from the host machine
  database: 'my', // From docker-compose.yml
  password: 'password', // From docker-compose.yml
  port: 5432, // Default PostgreSQL port
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// Endpoint to create a new table
app.post('/create-table', async (req, res) => {
  const { tableName, columns } = req.body;

  if (!tableName || !columns || !Array.isArray(columns) || columns.length === 0) {
    return res.status(400).json({ error: 'Table name and columns are required. Columns should be an array of column definitions.' });
  }

  const columnDefinitions = columns.map(col => `${col.name} ${col.type}`).join(', ');
  const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions});`;

  try {
    await pool.query(createTableQuery);
    res.status(201).json({ message: `Table '${tableName}' created successfully.` });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ error: 'Failed to create table.' });
  }
});

// Endpoint to create a 'users' table
app.post('/create-users-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    res.status(201).json({ message: "'users' table created successfully." });
  } catch (error) {
    console.error('Error creating users table:', error);
    res.status(500).json({ error: 'Failed to create users table.' });
  }
});

// Endpoint to add a new user
app.post('/add-user', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required: username, email, password' });
  }

  const insertUserQuery = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  try {
    const result = await pool.query(insertUserQuery, [username, email, password]);
    res.status(201).json({ message: 'User added successfully.', user: result.rows[0] });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
