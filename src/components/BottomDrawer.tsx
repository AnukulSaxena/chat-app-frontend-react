import { useEffect } from "react";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import { fetchUsers } from "@/store/action/user.action";
import { useAppDispatch, useAppSelector } from "@/store/store";
import UserCard from "./UserCard";

const BottomDrawer: React.FC<{mode: "users" | "friends"}> = ({mode}) => {
  
  const dispatch = useAppDispatch();
  const {userData} = useAppSelector(state => state.auth);
  const { users } = useAppSelector((state) => state.user);

  useEffect(() => {
    if(!userData) return
    dispatch(fetchUsers(userData._id));
  }, []);

  return (
    <DrawerContent className="h-96">
      <DrawerHeader>
        <DrawerTitle className="cursor-pointer" >{mode === "users" ? "Users" : "Friends"}</DrawerTitle>
        <DrawerDescription>{mode === "users" ? "These are the users." : "These are your friends."}</DrawerDescription>
      </DrawerHeader>
      <div className="flex gap-5 p-5 overflow-x-auto">
        {users.map((user, index) => (
          <UserCard key={index}  user={user} />
        ))}
      </div>

      <DrawerFooter>
        <DrawerClose>
        Cancel
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
};

export default BottomDrawer;
