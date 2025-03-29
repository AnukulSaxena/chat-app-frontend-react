import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppSelector } from "@/store/store";
import { socket } from "@/socket";

export default function ChatScreen() {
  const { activeChat } = useAppSelector((state) => state.chat);
  const { isSocketConnected } = useAppSelector((state) => state.user);
  if (!activeChat) return null;


  const [inputValue, setInputValue] = useState("");
  const [chatName, setChatName] = useState("");
  const [counter, setCounter] = useState(0);
  const [chats, setChats] = useState<string[]>([]);

  // const handleSendMessage = () => {
  //   if (inputValue.trim() === "") return;

  //   setMessages([
  //     ...messages,
  //     { id: messages.length + 1, user: "user", text: inputValue },
  //   ]);
  //   setInputValue("");

  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: prev.length + 1,
  //         user: "bot",
  //         text: "Sure! What do you need help with?",
  //       },
  //     ]);
  //   }, 1000);
  // };

  useEffect(() => {
    if (!activeChat.isGroup && activeChat.users.length > 0) {
      setChatName(activeChat.users[0].userName);
    }
  }, [activeChat]);

  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    socket.on("message", (data: any) => {
      console.log(data);
      console.log(counter);
      setCounter(prev => prev + 1)
      setChats(prev => [...prev, data.message]);
    });

    return () => {
      if (socket && isSocketConnected) socket.off("message");
    };
  }, [isSocketConnected]);  

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

  return (
    <div className="flex flex-col h-full bg-neutral-900">
      {/* Chat Header */}
      <header className="p-4 bg-neutral-950 text-lg font-semibold">
        {chatName}
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
{
  chats.map((chat) => (<div>{chat}</div>))
}
       
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
