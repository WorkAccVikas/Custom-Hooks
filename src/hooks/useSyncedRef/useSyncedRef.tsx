import { useEffect, useRef } from "react";

/**
 * useSyncedRef
 * -----------------------------------------------------------------------------
 * Keeps a mutable ref in sync with the latest value across renders.
 *
 * This hook is primarily used to avoid **stale closures** inside:
 * - long-lived effects (setInterval, subscriptions, observers)
 * - async callbacks (timeouts, promises, event listeners)
 * - handlers that must always read the latest state/props
 *
 * Unlike state, updating `ref.current` does NOT trigger a re-render.
 * The ref identity is stable for the entire component lifecycle.
 *
 * -----------------------------------------------------------------------------
 * Behavior & Guarantees
 * -----------------------------------------------------------------------------
 * - `ref.current` will always contain the **latest committed value**
 *   after React has flushed effects.
 * - The returned ref object is **stable** and never changes.
 * - Safe to use with React 18+ (Concurrent Rendering & StrictMode).
 * - Prevents dependency array inflation in effects.
 *
 * -----------------------------------------------------------------------------
 * Important Constraints
 * -----------------------------------------------------------------------------
 * - `ref.current` is NOT guaranteed to be updated during render.
 *   Do NOT rely on it for render-time logic.
 * - The sync occurs in `useEffect`, which runs after paint.
 * - This hook does not perform deep comparison or cloning.
 *   Callers must ensure immutable updates.
 *
 * -----------------------------------------------------------------------------
 * When to Use
 * -----------------------------------------------------------------------------
 * ✅ Use when you need the latest value in:
 *    - effects that should not re-run
 *    - async or delayed callbacks
 *    - event listeners registered once
 *
 * ❌ Avoid when:
 *    - value is only used during render
 *    - effect dependencies can be expressed clearly
 *    - synchronous render-time correctness is required
 *
 * -----------------------------------------------------------------------------
 * @param value - Any value (state, prop, or derived data) to keep in sync.
 * @returns A mutable ref whose `.current` always points to the latest value.
 */
export function useSyncedRef<T>(value: T) {
  /**
   * Initialize ref once.
   * The initial value is used only for the first render.
   * The ref object itself remains stable across renders.
   */
  const ref = useRef<T>(value);

  /**
   * Sync the ref after each commit where `value` changes.
   * This ensures all effects and callbacks see the latest value
   * without re-subscribing or re-running logic.
   */
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
