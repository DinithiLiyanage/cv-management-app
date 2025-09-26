const jwt = require('jsonwebtoken');
const user = require("../Models/userModel");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Something wrong");
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded._id).select("-password");
        if (!req.user) {
            return res.status(401).json({message: "User not found"});
        }
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
};

module.exports = authMiddleware;