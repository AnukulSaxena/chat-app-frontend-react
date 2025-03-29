import { io, Socket } from "socket.io-client";
import { store } from "./store/store";
import { setSocketConnected } from "./store/slice/user.slice";

const URL = "http://localhost:5000";
let socket: Socket | null = null;
let count = 0;
let isSocketConnected = false;

const initializeSocket = (accessToken: string) => {
  socket = io(URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: false,
  });

  socket.on("connect", () => {
      console.log("connected to socket", count++);
    store.dispatch(setSocketConnected(true));
    isSocketConnected = true;
  });

  socket.on("disconnect", () => {
    store.dispatch(setSocketConnected(false));
    isSocketConnected = false;
  });

  socket.connect();
};

let previousAccessToken: string | null = null;
let hasInitialized = false;
let debounceTimeout: NodeJS.Timeout | null = null;

if (!hasInitialized) {
  store.subscribe(() => {
    const state = store.getState();
    const currentAccessToken = state.auth?.accessToken;
    const userData = state.auth?.userData;

    if (currentAccessToken !== previousAccessToken) {
      previousAccessToken = currentAccessToken;

      if (socket) {
        socket.disconnect();
        socket = null;
      }

      if (userData && currentAccessToken && !isSocketConnected) {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
          initializeSocket(currentAccessToken);
          debounceTimeout = null;
        }, 200);
      }
    }
  });
  hasInitialized = true;
}

export { socket };
