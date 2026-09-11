import React from "react";

const DtFilterWrapper = ({ children }) => {
  return (
    <div
      style={{ boxShadow: "0 0 15px 0 rgba(0, 0, 0, 0.1)" }}
      className="bg-light-blue  mb-4 rounded-lg px-6 py-4 font-roboto text-[16px] font-medium flex flex-wrap gap-8"
    >
      {children}
    </div>
  );
};

export default DtFilterWrapper;
