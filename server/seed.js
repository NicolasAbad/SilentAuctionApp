require('dotenv').config(); // ← Load .env variables at the top
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');
const Bid = require('./models/Bid');

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Drop all collections if they exist
    await mongoose.connection.dropDatabase();
    console.log('Dropped existing database content');

    // Insert sample users
    const users = await User.insertMany([
      {
        firebaseUID: 'uid_user_1',
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        role: 'user',
      },
      {
        firebaseUID: 'uid_admin',
        name: 'Admin User',
        email: 'admin@gmail.com',
        address: 'Admin Plaza',
        role: 'admin',
      },
    ]);

    // Insert sample items
    const items = await Item.insertMany([
      {
        title: 'Vintage Watch',
        description: 'Classic 1950s Omega watch',
        imageUrls: ['http://example.com/watch.jpg'],
        startingBid: 100,
        currentBid: 150,
        ownerId: users[0].firebaseUID,
        category: 'Accessories',
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Oil Painting',
        description: 'Colorful modern art piece',
        imageUrls: ['http://example.com/painting.jpg'],
        startingBid: 200,
        currentBid: 250,
        ownerId: users[1].firebaseUID,
        category: 'Art',
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    ]);

    // Insert sample bids
    await Bid.insertMany([
      {
        item: items[0]._id,
        userId: users[0].firebaseUID,
        amount: 150,
      },
      {
        item: items[1]._id,
        userId: users[1].firebaseUID,
        amount: 250,
      },
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
