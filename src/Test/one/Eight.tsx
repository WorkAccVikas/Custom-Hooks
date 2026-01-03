import { useEffect, useState, type JSX } from "react";
import { useSyncedRef } from "../../hooks/useSyncedRef/useSyncedRef";

function NetworkStatus_After(): JSX.Element {
  const [user, setUser] = useState({
    id: "1",
    isLoggedIn: false,
  });

  const userRef = useSyncedRef(user);

  useEffect(() => {
    const handleOnline = () => {
      // ✅ Always latest auth state
      if (userRef.current.isLoggedIn) {
        console.log("Sync user data");
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <button onClick={() => setUser({ ...user, isLoggedIn: true })}>
      Login
    </button>
  );
}

export default NetworkStatus_After;

// DESC : ✅ AFTER — Correct (Using useSyncedRef)
