import { useEffect, useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { socket } from "@/socket";
import { Message } from "@/schemas/message/message.schema";
import { getChatMessages } from "@/store/action/chat.action";
import { clearMessages } from "@/store/slice/chat.slice";

export default function ChatScreen() {
  const dispatch = useAppDispatch();

  const { activeChat, messages, loading } = useAppSelector(
    (state) => state.chat
  );
  const { userData } = useAppSelector((state) => state.auth);

  if (!activeChat || !userData) return null;

  const [inputValue, setInputValue] = useState("");
  const [chatName, setChatName] = useState("");

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChat.isGroup && activeChat.users.length > 0) {
      setChatName(activeChat.users[0].userName);
    }
    console.log("chatinve", activeChat);
    dispatch(clearMessages());
    dispatch(getChatMessages(activeChat._id));
  }, [activeChat]);

  const sendMessage = () => {
    if (inputValue.trim() === "") return;

    if (socket) {
      const messagePayload = {
        receiver: activeChat.users.length > 0 ? activeChat.users[0]._id : null,
        isGroup: activeChat.isGroup,
        chatId: activeChat._id,
        message: inputValue,
      };
      console.log("emitting");
      socket.emit("message", messagePayload);
      setInputValue("");
    } else {
      console.error("Socket not connected or message is empty");
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between max-h-full bg-neutral-900">
      {/* Chat Header */}
      <header className="p-4 bg-neutral-950 text-lg font-semibold">
        {chatName}
      </header>

      <div className=" flex-1 overflow-y-auto" ref={chatMessagesRef}>
      {/* Chat Messages */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col p-4">
          {messages.map((message: Message) => (
            <div
              key={message._id}
              className={`rounded-xl p-2 mb-1 max-w-[70%] break-words
                ${
                  message.sender === userData._id
                    ? "bg-green-700 text-gray-100 light:bg-green-500 light:text-white self-end"
                    : "bg-gray-700 text-gray-300 light:bg-gray-100 light:text-black self-start"
                }
              `}
            >
              {message.text}
            </div>
          ))}
        </div>
      )}
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
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
