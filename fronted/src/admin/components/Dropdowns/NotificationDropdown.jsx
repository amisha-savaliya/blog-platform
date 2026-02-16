import React, { useRef, useState } from "react";
import { createPopper } from "@popperjs/core";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  // ✅ useRef (NOT createRef inside component)
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const toggleDropdown = () => {
    if (open) {
      setOpen(false);
    } else {
      createPopper(btnRef.current, popRef.current, {
        placement: "bottom-end",
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, 10] },
          },
        ],
      });
      setOpen(true);
    }
  };

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        ref={btnRef}
        onClick={toggleDropdown}
        className="text-blueGray-500 block py-1 px-3 focus:outline-none"
      >
        <i className="fas fa-bell text-lg"></i>
      </button>

      {/* DROPDOWN */}
      <div
        ref={popRef}
        className={`${
          open ? "block" : "hidden"
        } bg-white text-base z-50 py-2 rounded shadow-lg mt-2 min-w-[12rem]`}
      >
        {["Action", "Another action", "Something else here"].map((item) => (
          <button
            key={item}
            className="text-sm py-2 px-4 w-full text-left text-blueGray-700 hover:bg-blueGray-100"
          >
            {item}
          </button>
        ))}

        <div className="h-0 my-2 border border-solid border-blueGray-100" />

        <button className="text-sm py-2 px-4 w-full text-left text-blueGray-700 hover:bg-blueGray-100">
          Separated link
        </button>
      </div>
    </div>
  );
}
