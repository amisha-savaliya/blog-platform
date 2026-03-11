import React from "react";
import { createPopper } from "@popperjs/core";
import user from "../../assets/img/user.png";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/features/auth/authSlice";
import {useDispatch} from "react-redux";

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.useRef(null);
  const popoverDropdownRef = React.useRef(null);
  const navigate = useNavigate();

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };
  const dispatch=useDispatch();

  const closeDropdownPopover = () => setDropdownPopoverShow(false);

  const handleLogout = () => {
   dispatch(logout());
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverDropdownRef.current &&
        !popoverDropdownRef.current.contains(event.target) &&
        !btnDropdownRef.current.contains(event.target)
      ) {
        closeDropdownPopover();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        type="button"
        className="text-blueGray-500 block bg-transparent border-0"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 bg-blueGray-200 inline-flex items-center justify-center rounded-full overflow-hidden">
            <img
              alt="Admin"
              className="w-full h-full object-cover"
              src={user}
            />
          </span>
        </div>
      </button>

      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 py-2 list-none text-left rounded shadow-lg min-w-48 right-0"
        }
      >
        <button
          onClick={() => navigate("/profile")}
          className="w-full text-left text-sm py-2 px-4 text-blueGray-700 hover:bg-blueGray-100"
        >
          👤 My Profile
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="w-full text-left text-sm py-2 px-4 text-blueGray-700 hover:bg-blueGray-100"
        >
          ⚙️ Settings
        </button>

        <div className="h-0 my-2 border border-solid border-blueGray-100" />

        <button
          onClick={handleLogout}
          className="w-full text-left text-sm py-2 px-4 text-red-600 hover:bg-red-100"
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
};

export default UserDropdown;
