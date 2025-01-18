import { getUserChats } from "@/store/action/chat.action";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";

const Section = () => {
    
  const dispatch = useAppDispatch();

  const {userData} = useAppSelector(state => state.auth);
  const {chats} = useAppSelector(state => state.chat);


  useEffect(() => {
    if(!userData) return
    dispatch(getUserChats(userData._id));
  },[userData]);
  return <div className=" flex  min-h-screen">
<div className="w-96 space-y-2 border-r-2 border-neutral-200 p-4 min-h-full">
    {
        chats.map((chat, index) => (
            <div key={index} className=" bg-neutral-900 p-4 rounded-md shadow-md">
                <div className="flex justify-between">
                    <h1 className="text-lg font-semibold">Chatname: {chat._id}</h1>
                    <p className="text-sm text-neutral-500"> some time here</p>
                </div>
                <p className="text-sm text-neutral-500">someMessage</p>
            </div>
        ))
    }


</div>
  </div>;
};

export default Section;
