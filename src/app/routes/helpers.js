const { body, validationResult } = require("express-validator");
const { CustomError } = require("restaurants-utils");

const validRatingData = () => [
  body("ratings").notEmpty().isInt({ min: 1, max: 5 }).withMessage("valid ratings is required")
];

const isValidData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new CustomError(403, errors.array());
  }

  next();
};

module.exports = { validRatingData, isValidData };
