import { DataTypes, Model} from "sequelize";
import db from "../config/database.config";

export interface UserAttribute {
    id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    salt:string;
    address:string;
    phone:string;
    otp:number;
    otp_expiry:Date;
    verified:boolean
}


export class UserInstance extends Model<UserAttribute>{}

UserInstance.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false,

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
            notNull: {
                msg: "Email adress"
            },
            isEmail: {
                msg:"Please input a valid email"
            }
        }

    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: "Password is Required"
            }, notEmpty: {
                msg: "Provide a Password"
            }
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: "Firstname is Required"
            }, notEmpty: {
                msg: "Input your firstname"
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Lastname is Required"
            }, notEmpty: {
                msg: "Input your lastname"
            }
        }
    },
    salt: {
        type: DataTypes.STRING,
        allowNull:false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull:false,
        validate: {
            notNull: {
                msg: "phone number is required"
            },
            notEmpty: {
                msg: "Provide a Phone number"
            }
        }

    },
    otp: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP is required"
            },
            notEmpty: {
                msg: "Provide an OTP"
            }
        }
    },
    otp_expiry: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "OTP Expired"
            }
        }
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must be verified"
            },
            notEmpty: {
                msg: "USer must be verified"
            }
        }
    }
    
},
{
    sequelize: db,
    tableName: "user"
})
