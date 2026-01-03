import { useEffect, useState, type JSX } from "react";
import { useSyncedRef } from "../../hooks/useSyncedRef/useSyncedRef";

type FormState = {
  name: string;
  email: string;
};

function saveToServer(data: FormState): void {
  console.log("Saving", data);
}

function AutoSaveForm_After(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
  });

  // Keeps latest form state accessible to async code
  const formRef = useSyncedRef<FormState>(form);

  useEffect(() => {
    const id = window.setInterval(() => {
      // ✅ Always latest form
      saveToServer(formRef.current);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />

      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
    </>
  );
}

export default AutoSaveForm_After;

// DESC : ✅ AFTER — Correct (Using useSyncedRef)
