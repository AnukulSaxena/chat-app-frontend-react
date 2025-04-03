import { Chat } from "@/schemas/chat/chat.schema";
import { setActiveChat } from "@/store/slice/chat.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SingleChat = (props: { chat: Chat }) => {
  const dispatch = useDispatch();
  const { chat } = props;
  const [chatName, setChatName] = useState("");

  useEffect(() => {
    if (!chat.isGroup && chat.users.length > 0) {
      setChatName(chat.users[0].userName);
    }
    else if(chat.isGroup && chat.groupName) {
      setChatName(chat.groupName);}
  }, [chat]);
  
  return (
    <div
      onClick={() => dispatch(setActiveChat(chat))}
      className=" bg-neutral-900 p-4 rounded-md shadow-md cursor-pointer"
    >
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">{chatName}</h1>
        <p className="text-sm text-neutral-500"> some time here</p>
      </div>
      <p className="text-sm text-neutral-500">{chat.lastMessage ? chat.lastMessage : "last message"}</p>
    </div>
  );
};

export default SingleChat;
