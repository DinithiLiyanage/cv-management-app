const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        default: "",
    },
    memberCount: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
});

// add a text index across multiple fields
organizationSchema.index(
    { name: "text", description: "text", industry: "text", location: "text" },
    { default_language: "english" }
);

const Organization = mongoose.model("organization", organizationSchema);
module.exports = Organization;
