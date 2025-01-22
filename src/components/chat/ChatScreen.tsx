import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, user: "bot", text: "Hello! How can I assist you today?" },
    { id: 2, user: "user", text: "Hi, I need help with my account." },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    setMessages([
      ...messages,
      { id: messages.length + 1, user: "user", text: inputValue },
    ]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: "bot",
          text: "Sure! What do you need help with?",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Chat Header */}
      <header className="p-4 bg-neutral-950 text-lg font-semibold">Chat</header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.user === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                msg.user === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t bg-neutral-950">
        <div className="flex items-center space-x-2 ">
          <Input
            type="text"
            className="flex-1"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
