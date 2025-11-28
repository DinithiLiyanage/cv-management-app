const mongoose = require("mongoose");
const { Schema } = mongoose;

const userOrgSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "member", "recruiter", "pending"],
    },
});

// Create compound unique index
userOrgSchema.index({ userId: 1, orgId: 1 }, { unique: true });

const UserOrg = mongoose.model("UserOrg", userOrgSchema);
module.exports = UserOrg;
