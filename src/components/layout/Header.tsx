import BottomDrawer from "../BottomDrawer";
import CreateForm from "../auth/CreateForm";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import LoginForm from "../auth/LoginForm";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/action/user.action";
import { clearChats } from "@/store/slice/chat.slice";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData, sessionId } = useAppSelector((state) => state.auth);

  const handleLogout = (userName: string, sessionId: string) => {
    dispatch(logoutUser({ userName, sessionId }));
    dispatch(clearChats())
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Chat App</h1>

        <div className="flex gap-5">
          {userData === null && (
            <>
              <CreateForm />
              <LoginForm />
            </>
          )}
          {userData !== null && (
            <>
              <Button
                onClick={() => handleLogout(userData.userName, sessionId || "")}
              >
                Logout
              </Button>
              <Drawer>
                <DrawerTrigger className=" bg-neutral-800 px-4 rounded-md">
                  Users
                </DrawerTrigger>
                <BottomDrawer />
              </Drawer>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
