import { useEffect } from "react";

export function usePreventSelect() {
  useEffect(() => {
    const preventSelect = (e) => e.preventDefault();
    document.addEventListener("selectstart", preventSelect);
    return () => document.removeEventListener("selectstart", preventSelect);
  }, []);
}
