import { useEffect, useRef } from "react";
import { useSyncedRef } from "../useSyncedRef/useSyncedRef";

/**
 * A function that is executed when a component is *truly* unmounted
 * from the React tree.
 *
 * It may be synchronous or asynchronous.
 */
export type UnmountFn = () => void | Promise<void>;

/**
 * useOnUnmount
 * -----------------------------------------------------------------------------
 * Executes the provided callback **only when the component is permanently
 * removed from the UI**.
 *
 * ❗ Why this hook exists:
 * - In React 18 (development + StrictMode), React intentionally performs
 *   a `mount → unmount → mount` cycle to detect unsafe side-effects.
 * - A normal `useEffect(() => () => cleanup, [])` cleanup **will run during
 *   this fake unmount**, even though the component is still visible.
 *
 * This hook guarantees that the callback runs:
 * - ✅ on real unmount
 * - ❌ NOT on StrictMode fake unmounts
 *
 * -----------------------------------------------------------------------------
 * Design goals:
 * - StrictMode-safe (React 18+)
 * - Uses the latest callback (no stale closures)
 * - Does not re-register effects on every render
 * - Never throws during unmount (fail-safe)
 *
 * -----------------------------------------------------------------------------
 * When to use:
 * - Closing WebSockets
 * - Aborting background jobs
 * - Sending analytics / audit events
 * - Persisting drafts or form state
 * - Releasing global or external resources
 *
 * When NOT to use:
 * - console.log / debugging
 * - simple DOM cleanup
 * - effects that are safe to run multiple times
 *
 * -----------------------------------------------------------------------------
 * @param action - A function to run on *real* unmount
 */
export function useOnUnmount(action: UnmountFn): void {
  /**
   * Holds the latest version of the action callback.
   *
   * Why:
   * - Avoids stale closures
   * - Avoids adding `action` to the dependency array
   * - Allows the effect to run exactly once
   */
  const actionRef = useSyncedRef(action);

  /**
   * Tracks the "mount generation" of the component.
   *
   * React 18 StrictMode mounts, unmounts, and re-mounts the same component.
   * We use an incrementing id to detect whether a cleanup corresponds to
   * a real unmount or a fake one.
   */
  const mountIdRef = useRef(0);

  useEffect(() => {
    /**
     * Each time the component is mounted, increment the mount id.
     */
    mountIdRef.current += 1;

    /**
     * Capture the mount id for this specific lifecycle instance.
     */
    const mountIdAtSetup = mountIdRef.current;

    /**
     * Cleanup function — called on unmount.
     */
    return () => {
      /**
       * Defer execution to the next macrotask.
       *
       * Why:
       * - In StrictMode, React immediately re-mounts the component.
       * - By deferring, we can check whether a re-mount happened.
       */
      setTimeout(() => {
        /**
         * If the mount id is unchanged, the component was NOT re-mounted.
         * This means the unmount is real.
         */
        if (mountIdRef.current === mountIdAtSetup) {
          try {
            actionRef.current?.();
          } catch (error) {
            /**
             * Unmount logic must never crash the app.
             * Errors are swallowed and logged for safety.
             */
            console.error("useOnUnmount error:", error);
          }
        }
      }, 0);
    };

    /**
     * This effect must run exactly once.
     *
     * - `actionRef` is intentionally excluded because refs are stable.
     * - ESLint warning should be suppressed for this line.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
