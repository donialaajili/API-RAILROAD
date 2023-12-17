import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json('Token is not valid');
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorizationAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        try {

            if (verifyAdmin(req) || verifyAuthorization(req)) {
                next();
            } else {
                res.status(403).json("Permission denied.");
            }
        } catch (err) {
            res.status(500).json({ response: 'Internal server error: ' + err.message });
        }
    });
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        try {

            if (verifyAuthorization(req)) {
                next();
            } else {
                res.status(403).json("Permission denied.");
            }
        } catch (err) {
            res.status(500).json({ response: 'Internal server error: ' + err.message });
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (verifyAdmin(req)) {
            next();
        } else {
            res.status(403).json("Permission denied. Admins only.");
        }
    });
};

const verifyAdmin = (req) => {
    return  req.user.role === 'admin';
};

const verifyAuthorization = (req) => {
    return req.user && req.params.id === req.user.id;
};

export {
    verifyToken,
    verifyTokenAndAuthorizationAndAdmin,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
};
