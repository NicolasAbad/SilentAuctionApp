const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email:{type: String, required: true, unique: true},
    name:{type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'admin'}
},{timestamps: true});

module.exports = mongoose.Schema('Admin', adminSchema);