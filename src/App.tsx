import Header from "./components/layout/Header";
import { Toaster } from "./components/ui/sonner";
import Section from "./components/Section";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useAppSelector } from "./store/store";

function App() {
  const isConnectedRef = useRef(false);
  const {userData} = useAppSelector(state => state.auth);
  console.log('render')

  useEffect(() => {
    if(socket && socket.connected){
      isConnectedRef.current = true;
    }

  }, [socket]);

  useEffect(() => {
    console.log('isConnectedRef', isConnectedRef, userData);
    if (isConnectedRef && userData && socket) {
      console.log("join emitted");
      socket.emit("join", { user: userData._id });
    }
  }, [userData, isConnectedRef]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-full flex flex-col">
        <Header />
        <Section />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
