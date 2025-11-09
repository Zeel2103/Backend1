import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    
    const db = client.db('Store');
    const lessonsCol = db.collection('lessons');
    
    // Fetch and display all lessons
    const lessons = await lessonsCol.find({}).toArray();
    console.log('Lessons fetched from database:');
    console.log(lessons);
    
    // Set up routes
    app.get('/lessons', async (req, res) => {
      try {
        const lessons = await lessonsCol.find({}).toArray();
        res.json(lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
      }
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();