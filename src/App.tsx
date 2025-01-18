import Header from "./components/layout/Header";
import { Toaster } from "./components/ui/sonner";
import Section from "./components/Section";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { useAppSelector } from "./store/store";

function App() {
  const isConnectedRef = useRef(socket.connected);
  const {userData} = useAppSelector(state => state.auth);
  console.log('render')

  useEffect(() => {
    function onConnect() {
      isConnectedRef.current = true;
    }

    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  useEffect(() => {
    console.log('isConnectedRef', isConnectedRef, userData);
    if (isConnectedRef && userData) {
      console.log("join emitted");
      socket.emit("join", { user: userData._id });
    }
  }, [userData, isConnectedRef]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full">
        <Header />
        <Section />

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
