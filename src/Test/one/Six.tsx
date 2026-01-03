import { useCallback, useEffect, useState, type JSX } from "react";
import { useSyncedRef } from "../../hooks/useSyncedRef/useSyncedRef";

type Props = {
  onSave: () => void;
};

function Parent_After(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const onSave = useCallback((): void => {
    console.log("✅ AFTER | Saved with count:", count);
  }, [count]);

  return (
    <div>
      <h3>Parent Before</h3>

      <button onClick={() => setCount((c) => c + 1)}>
        Increment Count ({count})
      </button>

      <Child_After onSave={onSave} />
    </div>
  );
}

export default Parent_After;

// DESC : ✅ AFTER — Correct (Using useSyncedRef)

function Child_After({ onSave }: Props): JSX.Element {
  const onSaveRef = useSyncedRef(onSave);

  useEffect(() => {
    const id = window.setInterval(() => {
      // ✅ Always calls the LATEST onSave
      onSaveRef.current();
    }, 3000);

    return () => window.clearInterval(id);
  }, []);

  return <p>Auto-saving every 3 seconds...</p>;
}
