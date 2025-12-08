import { createContext, useContext, useRef, useCallback } from "react";

export const ClickHandlerContext = createContext(null);

export const ClickHandlerProvider = ({ children }) => {
  const clickHandlersRef = useRef(new Set());

  const registerClickHandler = useCallback((handler) => {
    clickHandlersRef.current.add(handler);
    return () => {
      clickHandlersRef.current.delete(handler);
    };
  }, []);

  const triggerAllClicks = useCallback(() => {
    clickHandlersRef.current.forEach((handler) => {
      try {
        handler();
      } catch (error) {
        console.warn("Error triggering click handler:", error);
      }
    });
  }, []);

  return (
    <ClickHandlerContext.Provider
      value={{
        registerClickHandler,
        triggerAllClicks,
      }}
    >
      {children}
    </ClickHandlerContext.Provider>
  );
};

export const useClickHandler = () => {
  const context = useContext(ClickHandlerContext);
  if (!context) {
    return { registerClickHandler: () => () => {}, triggerAllClicks: () => {} };
  }
  return context;
};

