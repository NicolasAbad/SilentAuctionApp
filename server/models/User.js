const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUID: {type: String, required: true},
    name: String,
    email: {type: String, required: true, unique: true},
    profilePicture: String,
    address: String,
    role:{type: String, default: "user"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.exports= mongoose.model("User", userSchema);