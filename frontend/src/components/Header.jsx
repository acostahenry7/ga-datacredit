import React from "react";
import Button from "./Button";

const Header = ({ title, btnTitle, btnOnClick }) => {
  return (
    <div className="pt-[62px] pb-[46px] flex justify-between items-center">
      <p className="text-[#313131] font-roboto font-semibold text-xl tracking-[4%]">
        {title}
      </p>
      {btnTitle && (
        <Button title={btnTitle} variant="darkLight" onClick={btnOnClick} />
      )}
    </div>
  );
};

export default Header;
