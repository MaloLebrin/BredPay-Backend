import { Role, Roles } from "./role";
import { Request, Response, NextFunction } from 'express'
import User from '../model/User'
import Company from '../model/Company'
import { IGetUserAuthInfoRequest } from "../types/types";


const checkRole = (Role: Roles) => {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        // const Company = require("../model/Company");
        const company = await Company.findById(req.user._id)
        if (!company) {
            // const User = require("../model/User");
            const user = await User.findById(req.user._id)
            if (!user) {
                return res.status(401).send("Not Allowed")
            } else if (user.role === Role.User) {
                return next()
            }
        } else if (company.role === Role.Company) {
            return next();
        }
        else {
            return res.status(401).send("Not Allowed")
        }
    }
}
export default checkRole;