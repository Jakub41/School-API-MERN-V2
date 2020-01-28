// Profile model
const { Student } = require("../models");
// Error handling
const { ErrorHandlers } = require("../utilities");

// Profiles Controller
const StudentsController = {
    // To GET ALL the profiles
    async getAll(req, res, next) {
        try {
            // Students from DB & count how many
            const students = await Student.find({});
            const studentsCount = await Student.countDocuments();

            // No students from DB then error via handler
            if (students.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    "No students have been found"
                );
            }

            // Sending response with results
            res.status(200).json({ count: studentsCount, students });
        } catch (err) {
            // Internal server error
            res.status(500).json(err);
        }
    },

    // To GET a student by id
    async getById(req, res) {
        // Send back the profile corresponding on the id
        res.json(res.id);
    },

    // To Create a new profile
    async createNew(req, res, next) {
        console.log(req.body);

        try {
            // Check empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to create");
            }

            // Profile init model
            const student = new Student({
                ...req.body
            });

            // Await the save
            const newStudent = await student.save();
            // If save fail send error via handler
            if (!newStudent) {
                throw new ErrorHandlers.ErrorHandler(
                    400,
                    "Student cannot be saved"
                );
            }

            // All OK send the response with results
            res.status(201).json({ message: "New student added", newStudent });
        } catch (err) {
            // Errors
            res.status(500).json(err);
        }
    },

    async update(req, res) {
        try {
            // Check for empty req.body
            if (Object.keys(req.body).length === 0) {
                throw new ErrorHandlers.ErrorHandler(500, "Nothing to update");
            } else {
                // Find id and update the fields
                const updatedStudent = await Student.findByIdAndUpdate(
                    { _id: res.id._id, updatedAt: new Date() },
                    req.body,
                    (err, response) => {
                        return response;
                    }
                );

                // Error check
                if (!updatedStudent) {
                    throw new ErrorHandlers.ErrorHandler(400, "Update failed");
                }

                // Send result
                res.json({ updatedFields: req.body, updatedStudent });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // To DELETE a student
    async delete(req, res) {
        try {
            // Removing the student by ID
            const deletedStudent = await res.id.remove();

            // Check
            if (!deletedStudent) {
                throw new Error(400, "Student already deleted");
            }

            // Message back
            res.json({ message: "Deleted student" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = StudentsController;
