const jwt = require("jsonwebtoken");
const user = require("../Models/userModel");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
    try {
        // Accept Authorization header or cookie fallback (if you use cookies)
        let authHeader =
            req.headers.authorization || (req.cookies && req.cookies.token);
        if (!authHeader) {
            console.log("No authorization header or token cookie provided");
            return res.status(401).json({ message: "No token provided" });
        }

        // Support "Bearer <token>" or raw token
        let token =
            typeof authHeader === "string" &&
            authHeader.toLowerCase().startsWith("bearer ")
                ? authHeader.split(" ")[1]
                : authHeader;

        // If token was accidentally JSON-stringified, strip surrounding quotes
        if (typeof token === "string") {
            token = token.replace(/^"|"$/g, "");
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Optional: quick sanity check for length/format (not required)
        // JWTs are typically three base64url parts separated by dots
        if (typeof token != "string" || token.split(".").length != 3) {
            console.warn(
                "Auth token does not look like a JWT (quick check failed)"
            );
            return res.status(401).json({ message: "Invalid token" });
        }

        // Verify token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment");
            return res
                .status(500)
                .json({ message: "Server configuration error" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded may contain id as `id` or `_id`
        const userId = decoded._id || decoded.id || decoded.userId;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.warn("Decoded token missing valid user id");
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = await user.findById(userId).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        return next();
    } catch (err) {
        // Don't leak internal error details to client; log for debugging
        console.error("Auth error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
