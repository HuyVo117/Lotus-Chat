import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";
import { io } from "../socket/index.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, imgUrl, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    // Validate: phải có content HOẶC imgUrl
    if (!content && !imgUrl) {
      return res.status(400).json({ message: "Thiếu nội dung hoặc ảnh" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: content || "",
      imgUrl: imgUrl || undefined,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content, imgUrl } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content && !imgUrl) {
      return res.status(400).json({ message: "Thiếu nội dung hoặc ảnh" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: content || "",
      imgUrl: imgUrl || undefined,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();
    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const uploadMessageImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Không có file được tải lên" });
    }

    console.log("📤 Uploading message image to Cloudinary...");
    const result = await uploadImageFromBuffer(file.buffer, {
      folder: "moji_chat/messages",
    });
    
    console.log("✅ Message image uploaded:", result.secure_url);

    return res.status(200).json({ imgUrl: result.secure_url });
  } catch (error) {
    console.error("❌ Lỗi khi upload message image:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
};