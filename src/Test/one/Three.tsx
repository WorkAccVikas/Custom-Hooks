import { useEffect, useState, type JSX } from "react";

function Chat_Before(): JSX.Element {
  const [roomId, setRoomId] = useState<string>("general");

  useEffect(() => {
    const handler = (): void => {
      // ❌ Always logs "general"
      console.log("Active room:", roomId);
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

export default Chat_Before;
