import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
export const protectRoute = async (req, res, next) => {

    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Acess Token not found" });

        }


        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;
            next();


        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Unauthorized - Access token expired!" });
            }
            throw error;

        }



    } catch (error) {

        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Access Token" });


    }


}

export const adminRoute = async (req,res,next) => {

    try {

        const user = req.user;
        if( user && user.role === 'admin'){
            next();
        }

        else{
            return res.status(403).json({message: "Unauthorized - Access denied! Admin Only!"});
        }
    } catch (error) {

        console.log("Error in adminRoute middleware", error.message);
        return res.status(401).json({message: "Unauthorized - Not an Admin"});
        
    }
}