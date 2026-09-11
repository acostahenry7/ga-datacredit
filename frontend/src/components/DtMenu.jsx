import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BsThreeDots } from "react-icons/bs";

const DtMenu = ({ options = [], status }) => {
  const buttonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let scale = 1;

      setPosition({
        top: rect.bottom * scale + window.scrollY,
        left: rect.left * scale,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!buttonRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (status != "OPENED") {
    options = options.filter((item) => item.id == 2 || item.id == 3);
  }

  return (
    <div className="">
      <button
        //disabled={status == "OPENED" ? false : true}
        ref={buttonRef}
        onClick={toggleMenu}
        className={`hover:bg-slate-200 py-0.5 px-2.5 cursor-pointer rounded-md transition-all duration-200 ${
          isOpen ? "bg-slate-200" : ""
        }`}
      >
        <BsThreeDots size={19} />
      </button>

      {isOpen &&
        createPortal(
          <ul
            className="absolute bg-white shadow-md  z-50 font-poppins text-[13px] rounded-md"
            style={{ top: position.top, left: position.left }}
          >
            {options.map((option, index) => (
              <MenuItem key={index} {...option} />
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};

const MenuItem = ({ label, icon, action }) => {
  return (
    <li
      className="flex items-center hover:bg-slate-200 cursor-pointer px-3 py-1.5 gap-2 text-slate-800"
      onClick={action}
    >
      {icon}
      <p className="text-[#828080] font-medium">{label}</p>
    </li>
  );
};

export default DtMenu;
