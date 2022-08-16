const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(1).max(25).required(),
  password: Joi.string().min(1).required(),
}).required();

const questionSchema = Joi.object({
  body: Joi.string().min(1).max(250).required(),
  answer: Joi.string().min(1).max(50).required(),
  points: Joi.number().valid(200, 400, 600, 800, 1000).required(),
});

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  questions: Joi.array().min(1).max(5).items(questionSchema),
});

const gameSchema = Joi.object({
  title: Joi.string().min(1).max(35).required(),
  access: Joi.string().valid("public", "private").required(),
  categories: Joi.array().min(1).max(6).items(categorySchema),
}).required();

module.exports = { gameSchema, userSchema };
