import { Role, Roles } from "./role";
import { Request, Response, NextFunction } from 'express'
import User from '../model/User'
import Company from '../model/Company'
import { IGetUserAuthInfoRequest } from "../types/types";


const checkRole = (Role: Role) => {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        const company = await Company.findById(req.user._id)
        if (!company) {
            const user = await User.findById(req.user._id)
            if (!user) {
                return res.status(401).send("Not Allowed")
            } else if (user.role === Role) {
                return next()
            }
        } else if (company.role === Role) {
            return next();
        }
        else {
            return res.status(401).send("Not Allowed")
        }
    }
}
export default checkRole;