
const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).max(14).required(),

  email: Joi.string().email().required(),

  age: Joi.number().min(18).required(),

  city: Joi.string().min(3).required(),
  // role: Joi.string().valid("user", "manager", "admin").default("user"),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  
});

const validateUser = (userData) => {
  const { error } = userSchema.validate(userData);

  if (error) {
    return error.details[0].message;
  }

  return null;
};

module.exports = {
  validateUser,
};
