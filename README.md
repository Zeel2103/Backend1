This repository contains the backend API for the GeniusLab lessons booking application. It is built using Express.js and connected to MongoDB Atlas. The backend is deployed on Render.com.

Project Links

Live Backend on Render (GET all lessons)

--> (https://backend1-so5u.onrender.com)

Environment Setup

The backend uses environment variables stored in a .env file.
For security reasons, the real .env is NOT included, but a template is provided.

1️⃣ Create your .env file

Run:

cp .env.example .env

2️⃣ Fill in the MongoDB connection string

The .env.example contains a connection string:

MONGODB_URI=mongodb+srv://user:user123@cluster0.vw0fx.mongodb.net/?appName=Cluster0

PORT=3000
 

