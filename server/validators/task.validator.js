const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(10).max(200).required(),
  categoryId: Joi.string().required(),
  userId: Joi.string().required(),
  status: Joi.string().valid("pending", "in-progress", "completed").default("pending"),
  isTemporary: Joi.boolean().optional().default(false),
});

const validateTask = (taskData) => {
  const { error } = taskSchema.validate(taskData);

  if (error) {
    return error.details[0].message;
  }

  return null;
};

module.exports = {
  validateTask,
};
