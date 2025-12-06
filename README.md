# **GeniusLab Backend API**



## ℹ️ Overview

This backend powers the **GeniusLab learning platform**, handling lesson retrieval, searching, ordering and inventory updates.  
It is built with **Node.js**, **Express.js**, and **MongoDB Atlas** and deployed using **Render.com**.

This project was developed for coursework to demonstrate full-stack development, API design, database operations and deployment.


## Usage

Here are some example API interactions:

### Fetch all lessons
```bash
GET https://backend1-so5u.onrender.com/lessons
```

### Place an order
```json
POST /orders
{
  "name": "John Doe",
  "phone": "07123456789",
  "email": "john@example.com",
  "address": "1 Example St, London",
  "items": [
    { "lessonId": "67900435d83fe0581136c758", "quantity": 1 }
  ]
}
```

### Search lessons
```bash
GET /lessons/search?query=math
```



## ⬇️ Installation (Local Setup)

Clone the repository:

```bash
git clone https://github.com/Zeel2103/Backend1.git
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Add your MongoDB URI and port:

```env
MONGODB_URI=mongodb+srv://user:user123@cluster0.vw0fx.mongodb.net/?appName=Cluster0
PORT=3000
```

Start the server:

```bash
node index.js
```

Visit:

```bash
http://localhost:3000/lessons
```


## 🌐 Deployment

The backend is deployed on **Render.com**.

Live URL for lessons:

```bash
https://backend1-so5u.onrender.com
```

