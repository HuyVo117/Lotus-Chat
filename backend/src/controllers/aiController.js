import axios from "axios";

export const sendAIMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

   
    const endpoint =
      process.env.LMSTUDIO_API_URL ||
      "http://127.0.0.1:1234/v1/chat/completions";

    const model = process.env.LMSTUDIO_MODEL || "lmstudio";

    // System prompt được tối ưu để trả lời ngắn gọn, tiếng Việt, lịch sự
    const systemPrompt = [
      "Bạn là Lotus AI assistant, trả lời ngắn gọn, rõ ý, tiếng Việt.",
      "Nếu câu hỏi mơ hồ hoặc thiếu dữ kiện, hãy xin thêm thông tin.",
      "Không bịa đặt, nếu không chắc hãy nói 'Mình chưa chắc, hãy cho mình biết thêm chi tiết.'",
      "Tránh nội dung nhạy cảm; lịch sự và thực tế."
    ].join(" ");

    const payload = {
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      top_p: 0.9,
      frequency_penalty: 0.1,
      max_tokens: 512,
    };

    const lmResponse = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    const text =
      lmResponse.data?.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, tôi chưa nhận được phản hồi từ mô hình.";

    return res.status(200).json({
      message: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.status(500).json({ 
      message: "Không thể xử lý yêu cầu AI. Vui lòng thử lại sau.",
      error: error.response?.data || error.message 
    });
  }
};

export const getAIHistory = async (req, res) => {
  try {
    // TODO: Implement AI history from database if needed
    return res.status(200).json({ history: [] });
  } catch (error) {
    console.error("AI History Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
