import Joi from "joi";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { APP_SECRET } from "../config/database.config";
import { AuthPayload } from "../interface";

export const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
  confirm_password: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("confirm password")
    .messages({
      "any.only": "{{#label}} does not match",
    }),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const Generatesignature = async (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, APP_SECRET) as JwtPayload;
};

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("[a-zA-Z0-9]{3,30}$")),
});

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};
