import { useEffect, useState, type JSX } from "react";
import { useSyncedRef } from "../../hooks/useSyncedRef/useSyncedRef";

function Chat_After(): JSX.Element {
  const [roomId, setRoomId] = useState<string>("general");
  const roomRef = useSyncedRef<string>(roomId);

  useEffect(() => {
    const handler = (): void => {
      // ✅ Always correct
      console.log("Active room:", roomRef.current);
    };

    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, []);

  return (
    <button
      onClick={() => setRoomId(roomId === "general" ? "random" : "general")}
    >
      Switch Room
    </button>
  );
}

export default Chat_After;
