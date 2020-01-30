// Auth libs
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Student model
const { Student } = require("../models");

const AuthController = {
    async register(req, res) {
        bcrypt.hash(req.body.password, 10).then(hash => {
            const student = new Student({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                dateOfBirth: req.body.dateOfBirth
            });
            student
                .save()
                .then(res => {
                    res.status(201).json({
                        message: "User successfully created!",
                        result: res
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
        });
    }
};

module.exports = AuthController;
