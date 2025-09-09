const CreateError = require('../Utils/appError');
const User = require('../Models/userModel');

const userController = {
    getProfile: async (req, res, next) => {
        try {
            const id  = req.params.id;
            const user = await User.findById(id).select("-password -__v");
            if (!user) return next(CreateError(404, "User not found"));
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;
            const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password -__v");
            if (!user) return next(CreateError(404, "User not found"));
            res.status(200).json(user);
        } catch (error) {
            console.error("Error updating user profile:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    }
};

module.exports = userController;
