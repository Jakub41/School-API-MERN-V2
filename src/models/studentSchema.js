const { Connect } = require("../db");
const { isEmail, isURL, toDate } = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

const projectSchema = {
    name: {
        type: String,
        minlength: [4, "Name need to be longer then 4 characters"],
        maxlength: [15, "Name cannot exceed 15 characters"],
        required: true,
        unique: true,
        sparse: true
    },

    description: {
        type: String,
        minlength: [25, "Description need to be longer then 25 characters"],
        maxlength: [125, "Description cannot exceed 125 characters"],
        required: true
    },

    linkRepo: {
        type: String,
        required: false,
        validate: {
            validator: string => isURL(string),
            message: "URL is not valid"
        }
    },

    linkLive: {
        type: String,
        required: false,
        validate: {
            validator: string => isURL(string),
            message: "URL is not valid"
        }
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    },

    updatedAt: {
        type: Date,
        default: Date.now,
        required: false
    }
};

const studentSchema = {
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is required"],
        validate: {
            validator: string => isEmail(string),
            message: "Provided email is invalid"
        }
    },

    dateOfBirth: {
        type: String,
        required: true,
        validate: {
            validator: string => toDate(string),
            message: "DoB invalid"
        }
    },

    project: [projectSchema],

    createdAt: {
        type: Date,
        default: Date.now,
        required: false
    },

    updatedAt: {
        type: Date,
        default: Date.now,
        required: false
    }
};

const collectionName = "student";

const studentSchemaModel = Connect.Schema(studentSchema);
studentSchemaModel.plugin(uniqueValidator, {
    message: "Username and/or Email already used"
});
const Student = Connect.model(collectionName, studentSchemaModel);

module.exports = Student;
