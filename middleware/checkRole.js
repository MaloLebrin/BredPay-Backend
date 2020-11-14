const checkRole = (role) => {
    return async (req, res, next) => {
        const Company = require("../model/Company");
        const company = await Company.findById(req.user._id)
        if (!company) {
            const User = require("../model/User");
            const user = await User.findById(req.user._id)
            if (!user) {
                return res.status(401).send("Not Allowed")
            } else if (user.role === role) {
                return next()
            }
        } else if (company.role === role) {
            return next();
        }
        else {
            return res.status(401).send("Not Allowed")
        }
    }
}
module.exports = checkRole;