/**
 * useEscapeToClose — closes the top-most open sheet or modal when Escape is
 * pressed. Open overlays form a stack so a sheet opened over another only
 * closes itself.
 */
import { useEffect, useRef } from "react";

type CloseRef = { current: () => void };

const stack: CloseRef[] = [];

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape" || stack.length === 0) return;
  event.preventDefault();
  stack[stack.length - 1].current();
}

export function useEscapeToClose(onClose: () => void, active = true) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!active) return;
    const entry = onCloseRef;
    stack.push(entry);
    if (stack.length === 1) window.addEventListener("keydown", handleKeyDown);

    return () => {
      stack.splice(stack.indexOf(entry), 1);
      if (stack.length === 0) window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active]);
}
