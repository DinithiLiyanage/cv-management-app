const { intervalToDurationWithOptions } = require('date-fns/fp');
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
    jobTitle: {
        type: String,
        default: '',
    },
    company: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    industry: {
        type: String,
        default: '',
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
    notifications: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model("user", userSchema);
module.exports = User;