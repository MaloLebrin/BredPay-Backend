const isAuthenticated = async (req, res, next) => {
    const User = require("../model/User");
    const Company = require("../model/Company");
    if (req.headers.authorization) {
        const token = await req.headers.authorization.replace("Bearer ", "");
        const user = await User.findOne({ token: token }).select(
            "account _id"
        );
        if (!user) {
            const company = await Company.findOne({ token: token }).select("account _id")
            if (!company) {
                return res.status(401).json({ error: "Unauthorized" });
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

module.exports = isAuthenticated;
