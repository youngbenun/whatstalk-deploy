const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).max(200).required(),
  index: Joi.number().min(0).default(0),
  userId: Joi.string().required(),
});

const validateCategory = (categoryData) => {
  const { error } = categorySchema.validate(categoryData);

  if (error) {
    return error.details[0].message;
  }

  return null;
};

module.exports = {
  validateCategory,
};
