import React from "react";

const Modal = ({ children }) => {
  return (
    <div
      className="fixed top-0 left-0 bottom-0 z-10 w-full h-full bg-[rgba(0,0,0,0.5)]
    flex items-center justify-center font-roboto overflow-hidden"
      style={{ zoom: "89.8%" }}
    >
      <div className="bg-light-blue max-xl:max-w-[2000px] md:max-w-[100%] w-[99%] max-sm:w-[95%] min-h-[200px]  px-9 py-6 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default Modal;
