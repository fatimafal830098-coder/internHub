import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "../api";
import ChatBox from "../components/ChatBox";

function Chat() {
  const user = useSelector(
    (state) => state.auth.user
  );

  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId) {
        return;
      }

      try {
        const response = await api.get(
          `/messages/${receiverId}`
        );
        console.log("Messages API response:", response.data);
setMessages(
  Array.isArray(response.data)
    ? response.data
    : response.data.messages || []
);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to load messages"
        );
      }
    };

    fetchMessages();
  }, [receiverId]);

  const handleSend = async (text) => {
    if (!receiverId) {
      setMessage(
        "Please enter a receiver ID."
      );
      return;
    }

    try {
      const response = await api.post(
        "/messages",
        {
          receiver: receiverId,
          text,
        }
      );

      setMessages([
        ...messages,
        response.data.data,
      ]);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send message"
      );
    }
  };

  if (!user) {
    return <p>Please login first.</p>;
  }

  return (
    <div className="chat-page">
      <h1>Chat</h1>

      <input
        type="text"
        placeholder="Enter receiver ID"
        value={receiverId}
        onChange={(e) =>
          setReceiverId(e.target.value)
        }
      />

      {message && <p>{message}</p>}

      <ChatBox
        messages={messages}
        onSend={handleSend}
      />
    </div>
  );
}

export default Chat;