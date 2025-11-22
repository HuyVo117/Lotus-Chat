
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/session.js";

const ACCESS_TOKEN__TTL = '30m';
const REFRESH_TOKEN__TTL = 7 * 24 * 60 * 60 * 1000; //7 ngay
export const signUp = async (req, res) => {
    try {
        const { username,password ,email,firstName,lastName } = req.body;

        if(!username || !password || !email || !firstName || !lastName){
            return res.status(400).json({ message: "Khong the thieu username, password, email, firstName hoac lastName" });
        }
        // kiem tra user da ton tai chua
        const duplicateUser = await User.findOne({ $or: [ { username }, { email } ] });
        if(duplicateUser){
            return res.status(409).json({ message: "Username hoac email da ton tai" });
        }

        // ma hoa password
        const hashedPassword = await bcrypt.hash(password, 10); //salt rounds = 10 so lan bcrypt ma hoa

        //tao user moi
        await User.create({
            username,
            email,
            hashedPassword,
            displayName: `${firstName} ${lastName}`,
        });


        //return success
        return res.sendStatus(204).json({ message: "Dang ky thanh cong" });

    } catch (error) {
        console.error("Loi khi goi Signp:", error);
        return res.status(500).json({ message: "Loi He Thong" });
        
    }
};

export const signIn = async (req, res) => {
try {
    //lay input tu body
    const {username,password}= req.body;
    if(!username || !password){
        return res.status(400).json({ message: " thieu username hoac password" });
    }
    // lay hashed password tu db so sanh voi password tu body
     const user = await User.findOne({username});

     if(!user){
        return res.status(401).json({message:"Khong tim thay user"});
     }
     //so sanh password
     const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
     if(!passwordCorrect){
        return res.status(401).json({message:" Username hoac password khong dung"});
     }

    // neu khop thi tao access token voi JWT
    const accessToken = jwt.sign(
        {
            userId: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN__TTL }
    );

    //tao refresh token 
const refreshToken = crypto.randomBytes(40).toString('hex');

    //tao session luu refresh token
    await Session.create({
        userId: user._id,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN__TTL), //7 ngay
    });

    //tra refresh token ve cho cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: REFRESH_TOKEN__TTL,
    });

    // tra access token ve cho res
    return res.status(200).json({ message: ` ${user.displayName} dang nhap thanh cong`, accessToken });

} catch (error) {
     console.error("Loi khi goi Signup:", error);
        return res.status(500).json({ message: "Loi He Thong" });
}
};  
export const signOut = async (req, res) => {
try {
    // lay refresh token tu cookie
    const token = req.cookies?.refreshToken;
    if(!token){
        
    // xoa refrest token trong session
        await Session.deleteOne({refreshToken:token});

    }
    // xoa cookie tren trinh duyet
    res.clearCookie('refreshToken');
    return res.sendStatus(204).json({message:"Dang xuat thanh cong"});

} catch (error) {
    console.error("Loi khi goi Signout:", error);
    return res.status(500).json({ message: "Loi He Thong" });
}
};