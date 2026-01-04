import { useEffect, useState } from "react";

const One = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? "Hide" : "Show"}
      </button>

      {isVisible && <Child />}
    </>
  );
};

export default One;

const Child = () => {
  useEffect(() => {
    console.log("Mounted");

    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      try {
        const res = await fetch("https://dummyjson.com/test", { signal });

        if (!res.ok) {
          throw new Error("Request failed");
        }

        const data = await res.json();
        console.log(data);
      } catch (error) {
        // Abort is NOT an error scenario
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Fetch error:", error);
        }
      }
    }

    fetchData();

    return () => {
      console.log("Unmounted → aborting request");
      controller.abort();
    };
  }, []);

  return (
    <>
      <h1>Child Component</h1>
    </>
  );
};

/** DESC :
 *  - Here, API called twice due to strict mode (React 18) in development mode.
 *  - Solution, two.jsx
 */
