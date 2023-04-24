const { MongoClient } = require('mongodb');

// mongoDB connection string
const connectionString = process.env.MONGO_URI || "";

const client = new MongoClient(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
});

// use connect method to connect to server
module.exports = async function connectDatabase() {
    try {
      await client.connect();
      console.log('Connected to MongoDB Atlas!');
      return client.db();
    } catch (err) {
      console.log(err);
    }
}
