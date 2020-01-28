// Profile model
const { Student } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

// Profiles Controller
const ProjectsController = {
    async getAll(req, res, next) {
        try {
            const studentProjects= await Student.aggregate([
                { $match: { username: res.username.username } },
                {
                    $addFields: {
                        projectsCount: {
                            $size: "$project"
                        }
                    }
                },
                {
                    $project: {
                        projectsCount: 1,
                        username: 1,
                        project: 1,
                        _id: 0
                    }
                }
            ]);

            if (studentProjects.length > 0) {
                res.send({ studentProjects: studentProjects });
                //res.send({ profileExperiences: profileWithExperiences[0] });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            // Internal server error
            res.status(500).json(err);
        }
    }
};

module.exports = ProjectsController;
