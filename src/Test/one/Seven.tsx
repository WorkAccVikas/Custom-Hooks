import { useEffect, useState, type JSX } from "react";

type User = {
  id: string;
  isLoggedIn: boolean;
};

function NetworkStatus_Before(): JSX.Element {
  const [user, setUser] = useState<User>({
    id: "1",
    isLoggedIn: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      // ❌ Always false (initial state)
      if (user.isLoggedIn) {
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

export default NetworkStatus_Before;

// DESC : ❌ BEFORE (Buggy)