import { useEffect, useState } from "react";

function LoadingBar({ isLoading }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // wait a bit before hiding so it doesn’t flicker
      const timeout = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-blue-400 transition-all duration-500 ${
        visible ? "w-full opacity-100" : "w-0 opacity-0 h-0"
      }`}
    />
  );
}

export default LoadingBar;
