import React from "react";

interface ButtonProps {
  title: string;
  borderColor?: string;
  variant?: "light" | "dark" | "darkLight";
  width?: string;
  height?: number;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button = ({
  title,
  borderColor,
  variant = "light",
  width,
  height,
  onClick,
  icon,
  type,
}: ButtonProps) => {
  const variants = {
    light: "border-black hover:bg-black hover:text-white",
    dark: "bg-black text-light-blue border-black hover:bg-red-700 hover:border-red-700 hover:text-white",
    darkLight:
      "bg-black text-light-blue border-black hover:bg-light-blue hover:border-black hover:text-black",
  };

  return (
    <button
      onClick={onClick}
      type={type || "button"}
      style={{ width: width || "172px", height: height || "40px" }}
      className={`relative flex items-center justify-center gap-2 font-poppins font-normal border-2 rounded-full duration-200 ${
        variants[variant || "light"]
      }`}
    >
      {title || "button"}
      <div>{icon && <div className="absolute right-4 top-3">{icon}</div>}</div>
    </button>
  );
};

export default Button;
