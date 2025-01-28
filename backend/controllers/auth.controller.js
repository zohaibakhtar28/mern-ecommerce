import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';


const generateToken = (userId) => {

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });

    return { accessToken, refreshToken };
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token: ${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {

        httpOnly: true, //prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks
        maxAge: 15 * 60 * 1000, //15 minutes

    });

    res.cookie('refreshToken', refreshToken, {

        httpOnly: true, //prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', //only send cookie over https in production
        sameSite: "strict", //prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days

    });
}
export const signup = async (req, res) => {


    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        //authenticate
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

        setCookies(res, 'refreshToken', refreshToken);


        res.status(201).json({

            name: user.name,
            email: user.email,
            _id: user._id,
            role: user.role,

        });
    } catch (error) {
        console.log("Error in signup Controller", error.message);
        res.status(500).json({ message: error.message });

    }
};

//user -> login -> /api/auth/login -> compare password -> correct -> create access token and refresh token -> store refresh token in redis -> send access token and refresh token as cookies
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);


            res.json({

                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

        }else{
            res.status(401).json({message: "Invalid credentials"});
        }



    } catch (error) {
        console.log("Error in login Controller", error.message);
        
        res.status(500).json({ message: "server error", error: error.message });
    }
};

export const logout = async (req, res) => { // delete the refresh token from cookies stored inn redis.
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); //decode the refresh token
            await redis.del(`refresh_token: ${decoded.userId}`); //delete the refresh token from redis

        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ messaage: "Logged out sucessfullt" });




    } catch (error) {
        console.log("Error in logout Controller", error.message);
        res.status(500).json({ message: "server error", error: error.message });


    }
};


//recreats access token after it expires after 15 minutes
export const refreshToken = async (req, res) => {

    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken)
        {
            return res.status(401).json({message: "No refesh token provided"});
        }
    
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken  = await redis.get(`refresh_token: ${decoded.userId}`);
    
        if(refreshToken !== storedToken)
        {
            return res.status(401).json({message: "Invalid refesh token"});
        }
    
        const accessToken = jwt.sign({userId: decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });
    
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
    
        res.json({message : "Token refreshed successfully"});
        
    } catch (error) {
        console.log("Error in refreshToken Controller", error.message);
        res.status(500).json({message: "server error", error: error.message});
        
    }
   



};



export const getProfile = async (req, res) => { 

    try {
        res.json(req.user);
        
    } catch (error) {
        console.log("Error in getProfile Controller", error.message);
        res.status(500).json({message: "server error", error: error.message});
    }
}

