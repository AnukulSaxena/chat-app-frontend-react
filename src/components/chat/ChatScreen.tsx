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
  const { friends } = useAppSelector(state => state.relation);

  if (!activeChat || !userData) return null;

  const [inputValue, setInputValue] = useState("");
  const [chatName, setChatName] = useState("");
  const [myFriends, setMyFriends] = useState(new Map());

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a map of userId -> userName from friends data
    const friendsMap = new Map();
    friends.forEach(friend => {
      friendsMap.set(friend.userId, friend.userName);
    });
    setMyFriends(friendsMap);
  }, [friends]);

  useEffect(() => {
    if (!activeChat.isGroup && activeChat.users.length > 0) {
      // For one-on-one chats, use the friend's username from the map if available
      const friendId = activeChat.users[0]._id;
      const friendName = myFriends.get(friendId) || activeChat.users[0].userName;
      setChatName(friendName);
    } else if (activeChat.isGroup) {
      // For group chats, use the group name
      setChatName(activeChat.groupName || 'Group Chat');
    }
    console.log("chatinve", activeChat);
    dispatch(clearMessages());
    dispatch(getChatMessages(activeChat._id));
  }, [activeChat, myFriends]);

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
    <div className="flex flex-col justify-between bg-neutral-900">
      {/* Chat Header */}
      <header className="p-4 bg-neutral-950 text-lg font-semibold">
        {chatName}
      </header>

      <div className=" max-h-96 overflow-y-auto" ref={chatMessagesRef}>
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
              {activeChat.isGroup && message.sender !== userData._id && (
                <div className="text-xs font-semibold mb-1">
                  {myFriends.get(message.sender) || 'Unknown User'}
                </div>
              )}
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
