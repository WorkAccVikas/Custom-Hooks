import { useEffect, useState, type JSX } from "react";

type FormState = {
  name: string;
  email: string;
};

function saveToServer(data: FormState): void {
  console.log("Saving", data);
}

function AutoSaveForm_Before(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const id = window.setInterval(() => {
      // ❌ Always uses initial form state
      saveToServer(form);
    }, 5000);

    return () => window.clearInterval(id);
  }, []); // intentionally empty

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

export default AutoSaveForm_Before;

// DESC : ❌ BEFORE (Buggy – Stale Closure)🐛
