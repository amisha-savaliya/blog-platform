import React from "react";
import { createPopper } from "@popperjs/core";
import user from "../../assets/img/user.png"
import { useNavigate } from "react-router-dom";

const UserDropdown = () => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const navigate = useNavigate();

  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  // const token=localStorage.getItem("admintoken");

  const logout = () => {
  localStorage.removeItem("admintoken");
  // localStorage.removeItem("userToken");
  localStorage.removeItem("impersonationToken");

  navigate("/admin/login", { replace: true });

  
  window.location.reload();
};


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
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt="Admin"
              className="w-full rounded-full align-middle border-none shadow-lg"
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
        <a
          onClick={() => navigate("/admin/profile/")}
          className="text-sm py-2 px-4 font-normal block cursor-pointer text-blueGray-700 hover:bg-blueGray-100"
        >
          👤 My Profile
        </a>


        <a
          onClick={() => navigate("/admin/settings")}
          className="text-sm py-2 px-4 font-normal block cursor-pointer text-blueGray-700 hover:bg-blueGray-100"
        >
          ⚙️ Settings
        </a>

        <div className="h-0 my-2 border border-solid border-blueGray-100" />

        <a
          onClick={()=>logout()}
          className="text-sm py-2 px-4 font-normal block cursor-pointer text-red-600 hover:bg-red-100"
        >
          🚪 Logout
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
