import { useCallback, useEffect, useRef, useState } from "react";
import { api, post } from "../services/api";
import { createSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";

export function useChat() {

  const { token, user } = useAuth();
  const [users, setUsers] = useState([]),
    [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null),
    [messages, setMessages] = useState([]);
  const [error, setError] = useState(""),
    [connected, setConnected] = useState(false);
  const selectedRef = useRef(null),
    socketRef = useRef(null),
    requestRef = useRef(0);


  const refresh = useCallback(async () => {
    try {
      setConversations(await api("/chat/conversations", { token }));
    } catch (e) {
      setError(e.message);
    }
  }, [token]);
  
  useEffect(() => {
    let active = true;
    api("/chat/users", { token })
      .then((v) => {
        if (active) setUsers(v);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    refresh();
    const socket = createSocket(token);
    socketRef.current = socket;
    const onNew = (message) => {
      if (String(message.conversation) === String(selectedRef.current))
        setMessages((list) =>
          list.some((x) => x._id === message._id) ? list : [...list, message],
        );
    };
    const onUpdate = () => refresh();
    const onConnect = () => {
      setConnected(true);
      refresh();
      if (selectedRef.current)
        api(`/chat/conversations/${selectedRef.current}/messages`, { token })
          .then(setMessages)
          .catch(() => {});
    };
    const onDisconnect = () => setConnected(false);
    const onError = (err) => setError(err.message);
    socket.on("message:new", onNew);
    socket.on("conversation:updated", onUpdate);
    socket.on("conversation:refresh", onUpdate);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.connect();
    return () => {
      active = false;
      socket.off("message:new", onNew);
      socket.off("conversation:updated", onUpdate);
      socket.off("conversation:refresh", onUpdate);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, refresh]);
  async function select(c) {
    setSelected(c);
    selectedRef.current = c?._id || null;
    setMessages([]);
    setError("");
    if (!c) {
      ++requestRef.current;
      return;
    }
    const request = ++requestRef.current;
    try {
      const data = await api(`/chat/conversations/${c._id}/messages`, {
        token,
      });
      if (request === requestRef.current) setMessages(data);
    } catch (e) {
      setError(e.message);
    }
  }
  async function createDirect(userId) {
    const c = await post("/chat/conversations/direct", { userId }, token);
    await refresh();
    await select(c);
  }
  async function createGroup(name, memberIds) {
    const c = await post(
      "/chat/conversations/group",
      { name, memberIds },
      token,
    );
    await refresh();
    await select(c);
  }
  async function addMember(userId) {
    const c = await post(
      `/chat/conversations/${selected._id}/members`,
      { userId },
      token,
    );
    setSelected(c);
    await refresh();
  }
  async function send(text) {
    if (!selected || !connected) return false;
    try {
      const result = await new Promise((resolve, reject) =>
        socketRef.current
          .timeout(5000)
          .emit(
            "message:send",
            { conversationId: selected._id, text },
            (err, response) => (err ? reject(err) : resolve(response)),
          ),
      );
      if (!result.ok) throw new Error(result.error);
      return true;
    } catch (e) {
      setError(e.message || "שליחת ההודעה נכשלה");
      return false;
    }
  }
  return {
    user,
    users,
    conversations,
    selected,
    messages,
    error,
    setError,
    connected,
    select,
    createDirect,
    createGroup,
    addMember,
    send,
  };
}
