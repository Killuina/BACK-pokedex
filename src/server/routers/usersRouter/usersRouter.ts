import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import { paths } from "../../utils/paths.js";
import loginValidation from "../../schemas/loginUserSchema.js";
import registerValidation from "../../schemas/registerUserSchema.js";

const {
  users: {
    endpoints: { login, register },
  },
} = paths;

const usersRouter = Router();

usersRouter.post(register, registerValidation, registerUser);
usersRouter.post(login, loginValidation, loginUser);

export default usersRouter;
