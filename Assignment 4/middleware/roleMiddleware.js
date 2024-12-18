const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.session.role !== requiredRole) {
            return res.status(403).send("Access Denied: Insufficient permissions.");
        }
        next();
    };
};

module.exports = verifyRole;
