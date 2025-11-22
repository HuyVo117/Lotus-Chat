export const authMe = async (req, res) => { 
    try {
        const user = req.user; // lay user da duoc gan trong middleware xac thuc
        return res.status(200).json(user);
    } catch (error) {
        console.error("Loi khi lay thong tin user trong authMe: ", error);
        return res.status(500).json({ message: "Loi He Thong" });
        
    }
};
