import jwt from "jsonwebtoken";
import { handleErrors } from "../errors/handler.error";
import User from "../models/User";

//Check If User Token Exist
export const verifyToken = async (req, res, next) => {
    try {

        //Request cookie called 'jwt'
        const token = req.cookies['jwt'];

        //If there's no cookie called 'jwt', then return: 'No token was provided (You are not logged in)'
        if (!token) return res.status(403).json({ message: 'No token was provided (You are not logged in)' });

        //If there is a cookie, then decode it, get the user ID stored within it.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        //And use it to locate the user
        const user = await User.findById(req.userId, { password: 0 });

        //If there is no user then return: 'Unauthorized'
        if (!user) return res.status(404).json({ message: 'Unauthorized' });
        next();
    } catch (error) {
        handleErrors(error)
        console.log({ message: 'Authentication failed' })
        return res.status(401).json({ message: 'Authentication failed' });
    }
};

export const requireAuth = (res, req, next) => {
    const token = req.cookies['jwt'];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(403).json('Unauthorized');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        return res.status(400).json('Not Authorized');
    }
}

export const checkUser = (req, res, next) => {
    const token = req.cookies['jwt'];
    try {
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    next();
                } else {
                    console.log(decodedToken);
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                    next();
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}
