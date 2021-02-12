import { Response, NextFunction } from "express";
import User from '../model/User'
import Company from '../model/Company'

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token: string = await req.headers.authorization.replace("Bearer ", "");
        const user = await User.findOne({ token: token }).select(
            "account _id token email role"
        );

        if (!user) {
            const company = await Company.findOne({ token: token }).select("account _id token email role");
            if (!company) {
                return res.status(401).send({ error: "Unauthorized" });

            } else {
                req.user = company
                return next();
            }

        } else {
            req.user = user;
            return next();
        }

    } else {
        return res.status(401).json({ error: "non authorizé" });
    }
};
export default isAuthenticated;
