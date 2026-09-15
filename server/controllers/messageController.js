const Message = require("../models/Message");

// Get conversation between logged-in user and another user
const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: req.user._id,
        },
      ],
    })
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage")
      .sort({ createdAt: 1 });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get messages",
      error: error.message,
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text || !text.trim()) {
      return res.status(400).json({
        message: "Receiver and message text are required",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text: text.trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name profileImage")
      .populate("receiver", "name profileImage");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Mark messages from another user as read
const markMessagesAsRead = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: req.user._id,
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    res.json({
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  markMessagesAsRead,
};