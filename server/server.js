const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // loading the environment variables

// express initialization
const app = express();

// middleware setup for backend - frontend communication
app.use(cors());
app.use(express.json());

// port and mongodb URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// connecting to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
})
.then(() => console.log('MongoDB is ready to rock and roll'))
.catch((err) => console.log('MongoDB connection error:', err));

// basic route for testing the server
app.get('/', (req, res) => res.send('Server is running and rolling'));

// auth routes for handling authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

//itemRoutes for creating  and exploring item 
const itemRoutes = require('./routes/item');
app.use('/api/items', itemRoutes);

const bidRoutes = require('./routes/bid');
app.use('/api/bids/', bidRoutes);


//route for testing dashboard
const protectedRoutes = require('./routes/protected');
app.use('/api', protectedRoutes); // just for testing verifyToken




// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// start the server
app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
