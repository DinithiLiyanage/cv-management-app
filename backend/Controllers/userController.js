const CreateError = require("../Utils/appError");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

const userController = {
    getProfile: async (req, res, next) => {
        try {
            const id = req.params.id;
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
            if (req.body.notifications !== undefined) {
                req.body.emailNotifications = req.body.notifications;
                req.body.pushNotifications = req.body.notifications;
                req.body.marketingEmails = req.body.notifications;
                delete req.body.notifications; // Optionally remove the generic field
            }
            const updates = req.body;
            
            const user = await User.findByIdAndUpdate(id, updates, {
                new: true,
            }).select("-password -__v");
            if (!user) return next(CreateError(404, "User not found"));
            res.status(200).json(user);
        } catch (error) {
            console.error("Error updating user profile:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    getAccount: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await User.findById(id).select("email name -_id");
            if (!user) return next(CreateError(404, "User not found"));
            res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user account:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    updateAccount: async (req, res, next) => {
        try {
            const id = req.params.id;
            const updates = req.body;
            const user = await User.findByIdAndUpdate(id, updates, {
                new: true,
            }).select("email username createdAt -_id");
            if (!user) return next(CreateError(404, "User not found"));
            res.status(200).json(user);
        } catch (error) {
            console.error("Error updating user account:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    changePassword: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { currentPassword, newPassword } = req.body;  
            if (!currentPassword || !newPassword) {
                return next(CreateError(400, "Current and new passwords are required"));
            }

            const user = await User.findById(id);
            if (!user) return next(CreateError(404, "User not found"));

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return next(CreateError(401, "Current password is incorrect"));

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error("Error changing password:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },
}

module.exports = userController;
