import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());


// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.Url}`);
    next();
});

app.use('/images', express.static('images'));

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

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

        app.get('/lessons', async (req, res) => {
            try {
                // Read query parameters from the URL (e.g., ?sortBy=price&order=asc)
                const sortBy = req.query.sortBy || 'subject'     // default field
                const order = req.query.order === 'desc' ? -1 : 1 // 1 = ascending, -1 = descending

                console.log(`Sorting by ${sortBy} (${order === 1 ? 'asc' : 'desc'})`)

                // Sort dynamically based on query parameters
                const lessons = await lessonsCol
                    .find({})
                    .sort({ [sortBy]: order })
                    .toArray()

                res.json(lessons)
            } catch (error) {
                console.error('Error fetching lessons:', error)
                res.status(500).json({ error: 'Failed to fetch lessons' })
            }
        })


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