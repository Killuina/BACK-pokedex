import { type Response, type NextFunction, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../../../database/models/User";
import { type UserCredentials, type UserLoginCredentials } from "../../types";
import { CustomError } from "../../../CustomError/CustomError";
import { loginUser, registerUser } from "./userControllers";
import statusCodes from "../../utils/statusCodes";
import { mockUserCredentials } from "../../../mocks/userMocks";

const {
  success: { okCode, resourceCreated },
  clientError: { unauthorized },
  serverError: { internalServer },
} = statusCodes;

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const req: Partial<
  Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserLoginCredentials
  >
> = {};
const next: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  const mockUserLoginCredentials: UserLoginCredentials = {
    username: "rasputin",
    password: "rasputin11",
  };

  describe("When it receives a request with a username 'rasputin' and password 'rasputin11' and the user is not registered in the database", () => {
    test("Then it should call its next method with a status 401 and the messages 'Wrong username' and 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong username",
        unauthorized,
        "Wrong credentials"
      );
      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserLoginCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with a username 'rasputin' and password 'rasputin11' and the user is registered in the database but the passwords don't match", () => {
    test("Then it should call its next method with a status 401 and the messages 'Wrong password' and 'Wrong credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong password",
        unauthorized,
        "Wrong credentials"
      );
      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserLoginCredentials,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserLoginCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When the database responds with an error", () => {
    test("Then it should call its next method", async () => {
      const databaseError = new Error("Error");

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockRejectedValue(databaseError),
      }));

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserLoginCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(databaseError);
    });
  });

  describe("When it receives a request with username `rasputin` and password `rasputin11` and the user is registered in the database", () => {
    const expectedToken = "mocken";
    const expectedResponseBody = { token: expectedToken };

    test("Then it should call its status method with 200", async () => {
      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserLoginCredentials,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserLoginCredentials
        >,
        res as Response,
        next
      );
      expect(res.status).toHaveBeenCalledWith(okCode);
    });

    test("Then it should call its json method with a token", async () => {
      req.body = mockUserLoginCredentials;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({
          ...mockUserLoginCredentials,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      await loginUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserLoginCredentials
        >,
        res as Response,
        next
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });
});

describe("Given the registerUser controller", () => {
  const req: Partial<
    Request<Record<string, unknown>, Record<string, unknown>, UserCredentials>
  > = {};

  describe("When it receives a request with email: 'test@test.com', username: 'test', and password: 'test1234'", () => {
    test("Then it should call its status method with okCode and json with message 'test registered!'", async () => {
      const expectedResponseBody = {
        message: `${mockUserCredentials.username} registered!`,
      };

      req.body = mockUserCredentials;

      User.create = jest.fn().mockResolvedValue(mockUserCredentials);

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(resourceCreated);
      expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
    });
  });

  describe("When it receives a request to register an user and there's an error on the database", () => {
    test("Then it should call next with an error with message 'Error registering user'", async () => {
      const registerUserError = new CustomError(
        "Error on the database",
        internalServer,
        "Error registering user"
      );

      User.create = jest.fn().mockRejectedValue(registerUserError);

      await registerUser(
        req as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        res as Response,
        next
      );

      expect(next).toHaveBeenCalledWith(registerUserError);
    });
  });
});
