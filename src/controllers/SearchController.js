const { Student } = require("../models");
const { ErrorHandlers } = require("../utilities");

const SearchController = {
    async getStudentBy(req, res) {
        try {
            // get search_criteria from query parameter
            // build a query object with it
            // send data
            const queryObj = {};

            if (qField !== "" && qValue !== "") {
                queryObj[qField] = qValue;
            }

            console.log("::queryObj:::", queryObj);

            const student = await Student.find(queryObj);

            if (student.length === 0) {
                throw new ErrorHandlers.ErrorHandler(
                    404,
                    `The query "${qField} = ${qValue}" does not produced any result`
                );
            }

            res.status(200).json({
                status: "success",
                data: student
            });
        } catch (err) {
            res.status(500).json({
                status: err
            });
        }
    }
};

module.exports = SearchController;
