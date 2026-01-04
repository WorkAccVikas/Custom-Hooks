import { useEffect, useState } from "react";
import { useOnUnmount } from "../../hooks/useOnUnmount/useOnUnmount";

const One = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <>
      <h1>
        Current user is{" "}
        <span className="font-bold">{isAdmin ? "admin" : "user"}</span>
      </h1>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setIsAdmin((prev) => !prev);
        }}
      >
        Toggle {isAdmin ? "User" : "Admin"}
      </button>

      {isAdmin && <AdminDashboard />}
    </>
  );
};
export default One;

function AdminDashboard() {
  const [counter, setCounter] = useState(0);

  useOnUnmount(() => {
    console.log("Admin Dashboard Completely Unmounted");
  });

  useEffect(() => {
    console.log("Admin Dashboard Mounted");

    return () => {
      console.log("Admin Dashboard Unmounted");
    };
  }, []);

  return (
    <>
      <div className="w-full h-125">
        <h1>Admin Dashboard</h1>
        <p>Counter: {counter}</p>
        <button onClick={() => setCounter((prev) => prev + 1)}>
          Increment
        </button>
      </div>
    </>
  );
}
