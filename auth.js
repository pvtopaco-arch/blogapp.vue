const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "blogSecret123";

// VERIFY - checks that a valid token was sent
const verify = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({
            message: "Authorization header is required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({
            message: "Token is required"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).send({
            message: "Invalid or expired token"
        });
    }
};

// VERIFY ADMIN - checks that the logged in user is an admin
const verifyAdmin = (req, res, next) => {

    if (!req.user || !req.user.isAdmin) {
        return res.status(403).send({
            message: "Access denied. Admin only."
        });
    }

    next();
};

module.exports = {
    verify,
    verifyAdmin
};
