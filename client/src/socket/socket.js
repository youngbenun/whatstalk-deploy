import { io } from "socket.io-client";
import { API_URL } from "../services/api";
export const createSocket = (token) =>
  io(API_URL, { auth: { token }, autoConnect: false });
