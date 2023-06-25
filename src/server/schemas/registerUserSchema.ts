import { Joi, validate } from "express-validation";

const registerUserSchema = {
  body: Joi.object({
    email: Joi.string()
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .max(20),
    username: Joi.string().required().max(12),
    password: Joi.string().required().min(8).max(20),
  }),
};

const registerValidation = validate(
  registerUserSchema,
  {},
  { abortEarly: false }
);

export default registerValidation;
