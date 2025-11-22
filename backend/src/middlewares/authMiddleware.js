import jwt from "jsonwebtoken";
import User from "../models/User.js";


// authentication middleware de bao ve cac route can xac thuc
export const protectedRoute = async (req, res, next) => {
    try {
        // lay token tu header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];// Bearer tokenvalue
        
        if(!token){
            return res.status(401).json({ message: "Khong tim thay token, truy cap bi tu choi" });
        }
        // xac minh token hop le hay ko 
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if(err){
                console.error("Loi xac minh token: ", err);
                return res.status(403).json({ message: "Access token het hann" });
            } 

        // lay user tu token
        const user = await User.findById(decodedUser.userId).select('-hashedPassword');
        if(!user){
            return res.status(404).json({ message: "Khong tim thay user" });
        }

        // gan user vao req de su dung o cac middleware hoac controller sau
        req.user = user;
        next();
    });
    } catch (error) {
        console.error("Loi khi xac minh JWT trong authMiddleware: ", error);
        return res.status(500).json({ message: "Loi He Thong" });
    }
}