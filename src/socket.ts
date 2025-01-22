import { io, Socket } from "socket.io-client";
import { store } from "./store/store";
import { setSocketConnected } from "./store/slice/user.slice";

const URL = "http://localhost:5000";
let socket: Socket | null = null;

const initializeSocket = (accessToken: string) => {
    console.log('initi -> ', accessToken)
  socket = io(URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: false,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
    store.dispatch(setSocketConnected(true));

  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    store.dispatch(setSocketConnected(false));
  });

  socket.connect();
};

let previousAccessToken: string | null = null;
store.subscribe(() => {
  const state = store.getState();
  const currentAccessToken = state.auth?.accessToken;
  const userData = state.auth?.userData;
  // console.log('store currentAccessToken --------> ', currentAccessToken, userData)

  if (currentAccessToken !== previousAccessToken) {
    previousAccessToken = currentAccessToken;

    if (userData && currentAccessToken && (!socket || !socket.connected)) {
      initializeSocket(currentAccessToken);
    }
  }
});

export { socket };
