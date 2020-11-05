const isAuthenticated = async (req, res, next) => {
    const User = require("../model/User");
    if (req.headers.authorization) {
        const token = await req.headers.authorization.replace("Bearer ", "");
        const user = await User.findOne({ token: token }).select(
            "accout _id"
        );
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            req.user = user;
            return next();
        }
    } else {
        return res.status(401).json({ error: "non authorizé" });
    }
};

module.exports = isAuthenticated;
