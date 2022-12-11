import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateOTP,
  onRequestOTP,
  emailHtml,
  sendMail,
  Generatesignature,
  verifySignature,
  loginSchema,
  validatePassword,
} from "../utils";
import { UserAttribute, UserInstance } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { FromAdminMail, userSubject } from "../config/database.config";

/**============================  Register User =======================**/
export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirm_password, firstName, lastName } =
      req.body;
    const uuiduser = uuidv4();

    const validateResult = registerSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    // Generate salt
    const salt = await GenerateSalt();

    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOTP();

    const User = await UserInstance.findOne({ where: { email: email } });

    if (!User) {
      await UserInstance.create({
        id: uuidv4(),
        email,
        password: userPassword,
        firstName,
        lastName,
        salt,
        address: "",
        phone,
        otp,
        otp_expiry: expiry,
        verified: false,
      });

      //  send otp to user
      await onRequestOTP(otp, phone);
      // send email to user
      const html = emailHtml(otp);
      await sendMail(FromAdminMail, email, userSubject, html);
      // check if user exist
      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;
      // Generate signature for user
      let signature = await Generatesignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });

      return res.status(201).json({
        message:
          "User created successfully,check your email or phone number for verification",
        signature,
      });
    }
    return res.status(400).json({
      message: "User already exist",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server error",
    });
  }
};
/**==========================    User verification   ====================**/
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.params.signature;
    const decode = await verifySignature(token);
    // To check if the user is registered
    const User = (await UserInstance.findOne({
      where: { email: decode.email },
    })) as unknown as any;
    if (User) {
      const { otp } = req.body;
      if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
        const updatedUser = (await UserInstance.update(
          { verified: true },
          { where: { email: decode.email } }
        )) as unknown as UserAttribute;
        let signature = await Generatesignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
        });
        res.status(200).json({
          signature,
          verified: updatedUser.verified,
        });
      }
    }
    res.status(400).json({
      Error: "Invalid crediential or OTP already expired",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server errorghh",
    });
  }
};

/**============================       User Login     ===========================**/

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttribute;
    if (User) {
      const validation = await validatePassword(
        password,
        User.password,
        User.salt
      );
      if (validation) {
        // Generate signature for user
        let signature = await Generatesignature({
          id: User.id,
          email: User.email,
          verified: User.verified,
        });
        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: User.email,
          verified: User.verified,
        });
      }
    }
    return res.status(400).json({
      message: "Wrong username or password",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server error",
    });
  }
};
