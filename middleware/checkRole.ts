import { Role } from "./role";
import { Response, NextFunction } from 'express'
import User from '../model/User'
import Company, { CompanyType } from '../model/Company'


const checkRole = (Role: Role) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const company: CompanyType = await Company.findById(req.user._id)
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