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

const BottomDrawer = () => {
  const dispatch = useAppDispatch();

  const { users } = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log("useEffect");
    dispatch(fetchUsers());
  }, []);

  return (
    <DrawerContent className="h-96">
      <DrawerHeader>
        <DrawerTitle>Users</DrawerTitle>
        <DrawerDescription>These are the users.</DrawerDescription>
      </DrawerHeader>
      <div className="flex gap-5 p-5 overflow=x-auto">
        {users.map((user, index) => (
          <UserCard key={index} user={user} />
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
