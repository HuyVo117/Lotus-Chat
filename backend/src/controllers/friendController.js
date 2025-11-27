import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';


export const sendFriendRequest = async (req, res) => {
try {
    const { to, message } = req.body;
    const from = req.user._id;
    // kiem tra da la ban chua
    if(from === to){
        return res.status(400).json({message: "Khong the gui yeu cau ket ban voi chinh minh"});
    }
    const userExists = await User.exists({_id: to});
    if(!userExists){
        return res.status(404).json({message: "Nguoi dung khong ton tai"});
    }

    let UserA = from.toString();   
    let UserB = to.toString();

    if (UserA > UserB) {
        [UserA, UserB] = [UserB, UserA];
    }
   const [friendExists, requestExists] = await Promise.all([
    Friend.findOne({userA: UserA}),
    FriendRequest.findOne({$or: [{from, to}, {from: to, to: from}]})
   ]);

   if(alreadyFriends){
    return res.status(400).json({message: "Da la ban voi nguoi dung nay"});
   }
    if(exitsRequest){
    return res.status(400).json({message: "Da ton tai yeu cau ket ban giua hai nguoi dung"});
    }
    const request = await FriendRequest.create({
        from,
        to,
        message
    });
    return res.status(201).json({message: "Da gui yeu cau ket ban", requestId: request._id});




} catch (error) {
    console.error("Loi khi gui yeu cau ket ban", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
}
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if(!request){
            return res.status(404).json({message: "Yeu cau ket ban khong ton tai"});
        }

        if(request.to.toString() !== userId.toString()){
            return res.status(403).json({message: "Khong co quyen chap nhan yeu cau ket ban nay"});
        }
        const userA = await Friend.create({

            userA: request.from,
            userB: request.to,
        });

        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select(  '_id username displayName avatarUrl').lean();



        return res.status(201).json({message: "Da chap nhan yeu cau ket ban", 
            newFriend: {
                _id: from?._id,
                displayName: from?.displayName,
                
                avatarUrl: from?.avatarUrl,
            
            }});


    } catch (error) {
        console.error("Loi khi chap nhan yeu cau ket ban", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });

    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if(!request){
            return res.status(404).json({message: "Yeu cau ket ban khong ton tai"});
        }
        if(request.to.toString() !== userId.toString()){
            return res.status(403).json({message: "Khong co quyen tu choi yeu cau ket ban nay"});
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({message: "Da tu choi yeu cau ket ban"});

    } catch (error) {
        console.error("Loi khi tu choi yeu cau ket ban", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const getAllFriends = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Loi khi lay danh sach ban be", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        
    }
    catch (error) {
        console.error("Loi khi lay danh sach yeu cau ket ban", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};
