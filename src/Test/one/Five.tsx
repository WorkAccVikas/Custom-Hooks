import { useCallback, useEffect, useState, type JSX } from "react";

type Props = {
  onSave: () => void;
};

function Parent_Before(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const onSave = useCallback((): void => {
    console.log("❌ BEFORE | Saved with count:", count);
  }, [count]);

  return (
    <div>
      <h3>Parent Before</h3>

      <button onClick={() => setCount((c) => c + 1)}>
        Increment Count ({count})
      </button>

      <Child_Before onSave={onSave} />
    </div>
  );
}

export default Parent_Before;

// DESC : ❌ BEFORE (Buggy)

function Child_Before({ onSave }: Props): JSX.Element {
  useEffect(() => {
    const id = window.setInterval(() => {
      // ❌ Always calls the FIRST onSave
      onSave();
    }, 3000);

    return () => window.clearInterval(id);
  }, []); // intentionally empty

  return <p>Auto-saving every 3 seconds...</p>;
}
