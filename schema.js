const Basejoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: { "string.escapeHTML": "{{#label}} must not include HTML!" },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return value;
      },
    },
  },
});

const Joi = Basejoi.extend(extension);

const userSchema = Joi.object({
  username: Joi.string().min(1).max(25).required().escapeHTML(),
  password: Joi.string().min(1).required().escapeHTML(),
}).required();

const questionSchema = Joi.object({
  body: Joi.string().min(1).max(1500).required().escapeHTML(),
  answer: Joi.string().min(1).max(1500).required().escapeHTML(),
  points: Joi.number().valid(200, 400, 600, 800, 1000).required(),
});

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(50).required().escapeHTML(),
  questions: Joi.array().min(1).max(5).items(questionSchema),
});

const gameSchema = Joi.object({
  title: Joi.string().min(1).max(35).required().escapeHTML(),
  access: Joi.string().valid("public", "private").required().escapeHTML(),
  categories: Joi.array().min(1).max(6).items(categorySchema),
}).required();

module.exports = { gameSchema, userSchema };
