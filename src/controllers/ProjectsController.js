// Student model
const { Student } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");
// MongoDB
const { ObjectID } = require("mongodb");

// Projects Controller
const ProjectsController = {
    // Get all the projects for the username
    async getAll(req, res, next) {
        try {
            // As it is embedded we use aggregate to do a "join" between the two schemas
            // then match the result for the username and showing the projects of it
            const studentProjects = await Student.aggregate([
                // Match for username
                { $match: { username: res.username.username } },
                {
                    // We adding an extra field to show how many projects
                    $addFields: {
                        projectsCount: {
                            // Size give back the count of the projects of the document
                            $size: "$project"
                        }
                    }
                },
                {
                    // Refer to => https://docs.mongodb.com/manual/reference/operator/aggregation/project/
                    $project: {
                        projectsCount: 1,
                        username: 1,
                        project: 1,
                        _id: 0
                    }
                }
            ]);

            // Check of the data result
            if (studentProjects.length > 0) {
                res.send({ studentProjects: studentProjects });
                //res.send({ profileExperiences: profileWithExperiences[0] });
            } else {
                // Sending the error if any
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            // Internal server error
            res.status(500).json(err);
        }
    },

    // Getting project by Id and username associated
    async getById(req, res) {
        try {
            // We match username and one project to show
            const studentWithOneProject = await Student.aggregate([
                { $match: { username: res.username.username } },
                {
                    // We just isolate for each project
                    // Refer to => https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/index.html
                    $unwind: "$project"
                },

                {
                    // Match for the projectId
                    $match: {
                        "project._id": new ObjectID(req.params.projectId)
                    }
                },

                {
                    // Fields we show
                    $project: {
                        username: 1,
                        project: 1,
                        _id: 0
                    }
                }
            ]);

            // Check for errors
            if (studentWithOneProject.length > 0) {
                res.status(200).json({ studentProject: studentWithOneProject });
            } else {
                throw new ErrorHandlers.ErrorHandler(500, "No data");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Create a new project matching the username
    async createNew(req, res) {
        try {
            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Req.body
            const newStudentProject = req.body;
            // Updating by pushing a new project
            const addStudentProject = await Student.findOneAndUpdate(
                { username: res.username.username },
                { $push: { project: newStudentProject } }
            );
            // Check if result
            if (addStudentProject) {
                res.status(200).json({
                    userName: res.username.username,
                    newProject: newStudentProject
                });
            } else {
                // Error
                throw new ErrorHandlers.ErrorHandler(500, "Post failed");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    async update(req, res) {
        try {
            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            }

            // Req.body
            const updateProject = req.body;

            // Set empty OBJ
            const set = {};

            // Loop the fields to update
            for (const field in updateProject) {
                set["project.$." + field] = updateProject[field];
            }

            // Update the updatedAt as nested element
            set["project.$.updatedAt"] = Date.now();

            // Update the project on that username
            const projectToUpdate = await Student.updateOne(
                {
                    username: res.username.username,
                    "project._id": req.params.projectId
                },
                { $set: set }
            );

            // Check and send
            if (projectToUpdate)
                res.json({ Message: "Updated", projectUpdated: req.body });
            else throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Delete a project
    async delete(req, res) {
        try {
            // Match with username and pull to remove the project
            await Student.findOneAndUpdate(
                { username: res.username.username },
                { $pull: { project: { _id: req.params.projectId } } },
                err => {
                    if (err) {
                        response.json(err);
                    }
                    res.json({ Message: "Deleted" });
                }
            );
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = ProjectsController;
