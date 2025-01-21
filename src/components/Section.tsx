import { getUserChats } from "@/store/action/chat.action";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";
import SingleChat from "./chat/SingleChat";
import ChatScreen from "./chat/ChatScreen";

const Section = () => {
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.auth);
  const { chats } = useAppSelector((state) => state.chat);

  useEffect(() => {
    if (!userData) return;
    dispatch(getUserChats(userData._id));
  }, [userData]);
  return (
    <div className=" flex h-full">
      <div className="w-96 space-y-2 border-r-2 border-neutral-200 p-4 min-h-full">
        {chats.map((chat, index) => (
          <SingleChat key={index} chat={chat} />
        ))}
      </div>
      <div className="w-full">
        <ChatScreen />
      </div>
    </div>
  );
};

export default Section;
