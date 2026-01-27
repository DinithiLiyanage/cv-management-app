const CreateError = require("../Utils/appError");
const Org = require("../Models/OrgModel");
const UserOrg = require("../Models/userOrgModel");
const { get } = require("mongoose");

const orgController = {
    createOrganization: async (req, res, next) => {
        try {
            const organization = req.body;
            const newOrg = new Org(organization);
            const savedOrg = await newOrg.save();
            res.status(201).json(savedOrg);
        } catch (error) {
            console.error("Error creating organization:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },

    getOrganization: async (req, res, next) => {
        try {
            const orgId = req.params.id;
            const organization = await Org.findById(orgId);
            if (!organization) {
                return next(CreateError(404, "Organization not found"));
            }

            let role = null;
            const userOrg = await UserOrg.findOne({
                userId: req.user_id,
                orgId: orgId,
            });
            if (userOrg) {
                role = userOrg.role;
            }
            res.status(200).json({ organization, role });
        } catch (error) {
            console.error("Error fetching organization:", error);
            next(CreateError(500, "Internal Server Error"));
        }
    },
};

module.exports = orgController;
