import React, { useEffect, useState } from "react";

const Notification = ({ message, color, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);

      // Hide notification after 3 seconds
      const timeout = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for slide-up animation to complete
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [message, onClose]);

  return (
    <div
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-white text-lg shadow-md transition-transform duration-500 ease-in-out ${
        visible ? "translate-y-5 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ backgroundColor: color }}
    >
      {message}
    </div>
  );
};

export default Notification;
