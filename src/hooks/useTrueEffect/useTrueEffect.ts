import { useEffect, useRef } from "react";

/**
 * Effect callback identical to useEffect:
 * - Can return a cleanup function
 * - Cleanup runs only on REAL unmount
 */
type TrueEffectCallback = () => void | (() => void);

type EffectCleanup = () => void;
type EffectResult = void | EffectCleanup;

/**
 * useTrueEffect
 * -----------------------------------------------------------------------------
 * React 18 StrictMode intentionally performs:
 *   mount → unmount → mount
 *
 * This hook behaves like useEffect([]) but:
 * - Ignores fake StrictMode lifecycles
 * - Executes effect only on REAL mount
 * - Executes cleanup only on REAL unmount
 *
 * -----------------------------------------------------------------------------
 * Guarantees:
 * - Effect runs exactly once (real mount)
 * - Cleanup runs exactly once (real unmount)
 * - Latest effect logic is used
 * - StrictMode & Concurrent safe
 */
export function useTrueEffect(effect: TrueEffectCallback): void {
  /**
   * Holds latest effect function (prevents stale closures)
   */
  const effectRef = useRef(effect);
  effectRef.current = effect;

  /**
   * Tracks component mount generations.
   * StrictMode introduces extra fake generations.
   */
  const generationRef = useRef(0);

  /**
   * Stores cleanup returned by the effect
   */
  const cleanupRef = useRef<undefined | (() => void)>(undefined);

  useEffect(() => {
    generationRef.current += 1;
    const generationAtMount = generationRef.current;

    const isStillReal = () => generationRef.current === generationAtMount;

    // REAL mount
    // runIfRealLifecycle(
    //   isStillReal,
    //   () => {
    //     cleanupRef.current = effectRef.current();
    //   },
    //   "effect"
    // );
    runIfRealLifecycle(
      isStillReal,
      () => {
        cleanupRef.current = normalizeEffectCleanup(effectRef.current());
      },
      "effect"
    );

    return () => {
      // REAL unmount
      runIfRealLifecycle(
        isStillReal,
        () => {
          cleanupRef.current?.();
        },
        "cleanup"
      );
    };

    // Intentionally run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Executes a function only if the component lifecycle is REAL
 * (not a React 18 StrictMode fake mount/unmount)
 */
export function runIfRealLifecycle(
  isStillReal: () => boolean,
  fn: () => void,
  label: string
): void {
  setTimeout(() => {
    if (!isStillReal()) return;

    try {
      fn();
    } catch (err) {
      console.error(`Strict lifecycle ${label} error:`, err);
    }
  }, 0);
}

/**
 * Normalizes a React-style effect return value.
 * Only functions are treated as valid cleanups.
 */
export function normalizeEffectCleanup(
  result: EffectResult
): EffectCleanup | undefined {
  return typeof result === "function" ? result : undefined;
}
