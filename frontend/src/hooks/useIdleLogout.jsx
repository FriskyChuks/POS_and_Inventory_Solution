// src/hooks/useIdleLogout.js
import { useEffect } from "react";

const useIdleLogout = (logout, timeout = 15 * 60 * 1000) => {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout(); // Call logout when idle
      }, timeout);
    };

    const activityEvents = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start the timer on mount

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout, timeout]);
};

export default useIdleLogout;
