const CreateError = require("../Utils/appError");
const User = require("../Models/userModel");
const UserOrg = require("../Models/userOrgModel");
const Organization = require("../Models/OrgModel");
const bcrypt = require("bcrypt");
const { request } = require("express");

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
                return next(
                    CreateError(400, "Current and new passwords are required")
                );
            }

            const user = await User.findById(id);
            if (!user) return next(CreateError(404, "User not found"));

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isMatch)
                return next(CreateError(401, "Current password is incorrect"));

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            console.error("Error changing password:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    getUserOrganizations: async (req, res, next) => {
        try {
            const id = req.params.id;

            // get membership records (lean for plain objects)
            const memberships = await UserOrg.find({ userId: id }).lean();

            // load all org docs in parallel
            const orgDocs = await Promise.all(
                memberships.map((m) =>
                    Organization.findById(m.orgId).select("-__v").lean()
                )
            );

            // combine membership + org doc into a single response item
            const combined = memberships.map((m, idx) => ({
                membership: m,
                organization: orgDocs[idx] || null,
            }));

            res.status(200).json(combined);
        } catch (error) {
            console.error("Error fetching user's organizations:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    requestToJoinOrganization: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { orgId, role } = req.body;
            const existingRequest = await UserOrg.findOne({
                userId: id,
                orgId: orgId,
            });
            if (existingRequest) {
                return next(
                    CreateError(
                        400,
                        "You have already requested to join this organization"
                    )
                );
            }
            const newRequest = new UserOrg({
                userId: id,
                orgId: orgId,
                role: role || "pending",
            });
            await newRequest.save();
            res.status(201).json({
                message: "Request to join organization submitted successfully",
            });
        } catch (error) {
            console.error("Error requesting to join organization:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    searchOrganizations: async (req, res, next) => {
        try {
            const q = (req.query.q || "").trim();
            const userId = req.params.userId;
            console.log("Search query:", q);

            let orgs;
            if (q) {
                // text search with score sorting
                orgs = await Organization.find(
                    { $text: { $search: q }},
                    { score: { $meta: "textScore" } }
                )
                    .sort({ score: { $meta: "textScore" } })
                    .limit(50)
                    .lean();
            }

            // get user membership details of the searched orgs
            const memberships = await UserOrg.find({ userId: userId }).lean();
            const membershipMap = {};
            memberships.forEach((m) => {
                membershipMap[m.orgId.toString()] = m;
            });

            // mark joined orgs
            orgs = orgs.map((org) => ({
                ...org,
                isMember: membershipMap[org._id.toString()] ? true : false,
                membership: membershipMap[org._id.toString()] || null,
            }));
            console.log("Search orgs:", orgs);
            res.json(orgs);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = userController;
