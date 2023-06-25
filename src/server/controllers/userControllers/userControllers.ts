import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import { type UserCredentials, type UserLoginCredentials } from "../../types";
import { type CustomJwtPayload } from "./types";
import statusCodes from "../../utils/statusCodes.js";

const {
  success: { okCode, resourceCreated },
  serverError: { internalServer },
} = statusCodes;

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserLoginCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, username }: UserLoginCredentials = req.body;
    const user = await User.findOne({ username }).exec();

    if (!user) {
      throw new CustomError("Wrong username", 401, "Wrong credentials");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError("Wrong password", 401, "Wrong credentials");
    }

    const jwtPayload: CustomJwtPayload = {
      sub: user?._id.toString(),
      username,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(okCode).json({ token });
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(resourceCreated).json({ message: `${username} registered!` });
  } catch {
    const registerUserError = new CustomError(
      "Error on the database",
      internalServer,
      "Error registering user"
    );

    next(registerUserError);
  }
};
