import React from "react";
import { useNavigate } from "react-router";

const ConfigCard = ({ label, icon, path }) => {
  const navigate = useNavigate();
  return (
    <div
      className="max-sm:w-full w-[200px] h-[100px] bg-light-blue rounded-xl text-dark- font-roboto flex items-center justify-center tracking-wide font-medium text-xl gap-3 cursor-pointer hover:bg-slate-200   icon-text-light-blue icon-hover:text-primary transition-colors duration-300 border-slate-200 border"
      onClick={() => {
        navigate(`/settings/${path}`);
      }}
    >
      <div className="icon">{icon}</div>
      {label}
    </div>
  );
};

export default ConfigCard;
