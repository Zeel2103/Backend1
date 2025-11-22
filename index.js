import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());


// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${res.statusCode} ${req.url}`);
    next();
});

app.use('/images', express.static('images'));

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

//const client = new MongoClient(process.env.MONGODB_URI);


// Connect to MongoDB and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB Atlas!');

        const db = client.db('Store');
        const lessonsCol = db.collection('lessons');
        const ordersCollection = db.collection('orders');

        // Fetch and display all lessons
        const lessons = await lessonsCol.find({}).toArray();
        console.log('Lessons fetched from database:');
        console.log(lessons);


        app.get('/lessons', async (req, res) => {
            try {
                // Read query parameters from the URL (e.g., ?sortBy=price&order=asc)
                const sortBy = req.query.sortBy || 'subject';     // default field
                const order = req.query.order === 'desc' ? -1 : 1; // 1 = ascending, -1 = descending

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


        // Lessons search endpoint
        app.get('/lessons/search', async (req, res) => {
            try {
                const searchQuery = req.query.query; // Extract the search term

                console.log("Search Query:", searchQuery);

                // Validate search query
                if (!searchQuery || searchQuery.trim() === "") {
                    return res.status(400).send({ error: true, message: "Search term is required." });
                }

                const searchTerm = searchQuery.trim();

                // Search across multiple fields in lessons
                const matchingLessons = await lessonsCol.find({
                    $or: [
                        { Subject: { $regex: searchTerm, $options: "i" } }, // Search in Subject field
                        { Location: { $regex: searchTerm, $options: "i" } }, // Search in Location field  
                        { Description: { $regex: searchTerm, $options: "i" } }, // Search in Description field
                    ]
                }).toArray();

                console.log("Matching Lessons:", matchingLessons);

                // If no lessons match or found return error
                if (matchingLessons.length === 0) {
                    return res.status(404).send({ error: true, message: "No matching lessons found." });
                }

                // Return the matching lessons
                res.send(matchingLessons);

            } catch (error) {
                console.error('Search error:', error);
                res.status(500).send({ error: true, message: "Internal server error during search." });
            }
        });

        // POST and save orders
        app.post('/orders', async (req, res) => {
            try {
                // Destructure expected fields from the body
                const { name, phone, email, address, items } = req.body

                // Validate that ALL fields are required
                if (!name || !phone || !email || !address || !Array.isArray(items) || items.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'All fields are required and at least one item.'
                    })
                }

                // Create order document object with all required fields
                const orderDoc = {
                    name,
                    phone,
                    email,
                    address,
                    items,              // Array of order items: [{ lessonId, quantity }]
                    createdAt: new Date()
                }

                // Insert the order document into the MongoDB collection
                const result = await ordersCollection.insertOne(orderDoc)

                // Return success response with the generated order ID
                res.status(201).json({
                    success: true,
                    orderId: result.insertedId
                })
            } catch (err) {
                // Log the error
                console.error('POST /orders error:', err)
                res.status(500).json({
                    success: false,
                    message: 'Failed to save order.'
                })
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