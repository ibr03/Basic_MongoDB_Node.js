const dotenv = require('dotenv').config();
const express = require('express');
const connectDatabase = require('./server/connection');
const { ObjectId } = require('mongodb');

const app = express();

const PORT = process.env.PORT || 8080;

// Body-parser
app.use(express.urlencoded({ extended: true}));

// post API to save a movie into db
app.post('/add-movie', async (req, res) => {
    const { name } = req.body; // assume movie name is sent in the request body
    const db = await connectDatabase();
    const collection = db.collection('movies');

    // Create a unique index on the 'name' field if it doesn't exist
    await collection.createIndex({ name: 1 }, { unique: true });

    try {
        const result = await collection.insertOne({ name });
        res.json(result);
    } catch (error) {
        if (error.code === 11000) { // Check if the error is a duplicate key error
            res.status(400).json({ error: 'Movie already exists!' });
        } else {
            res.status(500).json({ error: 'Something went wrong!' });
        }
    }
});
  
// Get all movies
app.get('/get-all', async (req, res) => {
    const db = await connectDatabase();
    const result = await db.collection('movies').find().toArray();
    res.json(result);
});

// Get single movie
app.get('/get-single', async (req, res) => {
    const id = new ObjectId(req.query.id);
    const db = await connectDatabase();
    const result = await db.collection('movies').findOne({ _id: id });
    res.json(result);
});

// GET request using pagination
app.get('/get-paginated', async (req, res) => {
    const { page, size } = req.query;
    const pageNumber = parseInt(page);
    const pageSize = parseInt(size);
    const skip = (pageNumber - 1) * pageSize;
    const db = await connectDatabase();
    const result = await db.collection('movies').find().skip(skip).limit(pageSize).toArray();
    res.json(result);
  });
  
app.listen(PORT, () => { console.log(`Server running on http://localhost:${PORT}`) });
