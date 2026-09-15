import { useState } from "react";

function ChatBox({ messages = [], onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    onSend(text.trim());
    setText("");
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="chat-message"
            >
              <p>{message.text}</p>

              <small>
                {message.sender?.name || "User"}
              </small>
            </div>
          ))
        )}
      </div>

      <form
        className="chat-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;