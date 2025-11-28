const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    experiences: {
        type: [Object],
        default: [],
    },
    careerGoals: {
        type: [String],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    certifications: {
        type: [String],
        default: [],
    },
    salaryExpectations: {
        type: String,
        default: '',    
    },
    jobType: {
        type: [String],
        default: [],
    },
    workLocation: {
        type: String,
        default: '',
    },
    emailNotifications: {
        type: Boolean,
        default: true,
    },
    pushNotifications: {
        type: Boolean,
        default: true,
    },
    marketingEmails: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model("user", userSchema);
module.exports = User;