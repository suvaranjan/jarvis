// hooks/useAutoResizeTextarea.js
import { useEffect } from "react";

const MAX_HEIGHT = 200;

export const useAutoResizeTextarea = (ref, value) => {
  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.overflowY = "hidden";

    const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  }, [value, ref]);
};
