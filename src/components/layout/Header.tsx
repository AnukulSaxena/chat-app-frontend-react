import BottomDrawer from "../BottomDrawer";
import CreateForm from "../auth/CreateForm";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import LoginForm from "../auth/LoginForm";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Button } from "../ui/button";
import { logoutUser } from "@/store/action/user.action";
import { clearChats } from "@/store/slice/chat.slice";
import { socket } from "@/socket";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userData, sessionId } = useAppSelector((state) => state.auth);
  const { isSocketConnected } = useAppSelector((state) => state.user);

  const handleLogout = (userName: string, sessionId: string) => {
    dispatch(logoutUser({ userName, sessionId }));
    dispatch(clearChats());
    if(socket){
      socket.disconnect();
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">My Chat App</h1>
          {isSocketConnected ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full">
              Online
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full">
              Offline
            </span>
          )}
        </div>

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
