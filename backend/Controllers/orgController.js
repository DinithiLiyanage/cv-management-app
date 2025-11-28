const CreateError = require("../Utils/appError");
const Org = require("../Models/OrgModel");
const UserOrg = require("../Models/userOrgModel");

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
};

module.exports = orgController;
