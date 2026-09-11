import { useState } from "react";
import logo from "../assets/ga-logo.png";
import logoFull from "../assets/ga-logo-full.png";
import { FiMenu, FiTool, FiLogOut, FiSettings } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Button from "./Button";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Nav = ({ companyName, userName }) => {
  const { signout } = useAuth();
  const [toggleNav, setToggleNav] = useState(undefined);
  const navigate = useNavigate();

  const handleSignout = () => {
    setToggleNav((state) => !state);
    signout();
  };

  return (
    <nav className=" font-roboto">
      {/* Mobile Navigation */}
      <div className="">
        <div className="flex md:hidden justify-between items-center">
          <img
            src={logo}
            alt="logo"
            width={50}
            height={50}
            onClick={() => navigate("/")}
          />
          <h4 className="font-roboto text-dark-gray font-base text-xl">
            {companyName || "LASA MOTORS"}
          </h4>
          <FiMenu
            size={40}
            className="cursor-pointer"
            onClick={() => {
              setToggleNav((prev) => !prev);
            }}
          />
        </div>
        <div
          className={`z-10 ${
            toggleNav ? "" : "hidden"
          } absolute top-0 right-0 bg-black h-full w-full animate-fadeIn7`}
          onClick={() => setToggleNav(false)}
        ></div>
        <div
          className={`z-20 ${
            toggleNav == undefined ? "hidden" : ""
          } md:hidden fixed top-0 right-0 bg-black w-[70%] h-full text-white padding rounded-tl-[35px] ${
            toggleNav ? "animate-moveIn" : "animate-moveOut"
          } `}
        >
          <div className="flex justify-between">
            <IoClose
              size={40}
              className="text-dark-gray cursor-pointer"
              onClick={() => {
                setToggleNav(false);
              }}
            />
            <div className="bg-[#171B27] rounded-full p-0.5">
              <img src={logo} alt="logo" width={35} height={35} />
            </div>
          </div>
          <div className="mt-9 text-center">
            <p className="text-[#C5C9D3]">Bienvenido</p>
            <h4 className="text-2xl">{userName || "Rafael Espinosa"}</h4>
          </div>
          <ul className="mt-8 flex flex-col gap-6">
            <li
              className="flex cursor-pointer "
              onClick={() => {
                navigate("/settings");
                setToggleNav(false);
              }}
            >
              <FiTool size={24} />
              <p className="ml-4 text-[#C5C9D3] hover:shadow-lg shadow-white">
                Configuración
              </p>
            </li>
            <li className="flex cursor-pointer" onClick={handleSignout}>
              <FiLogOut size={24} />
              <p className="ml-4 text-[#C5C9D3]">Salir</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center">
        <img
          className="cursor-pointer"
          onClick={() => navigate("/")}
          src={logoFull}
          alt="logo"
          width={240}
          height={40}
        />
        <h4 className=" text-dark-gray">
          {companyName || "LASA MOTORS"} | {userName || "Rafael Espinosa"}
        </h4>
        <div className="flex gap-3">
          {/* <Button title="Configuración" /> */}
          <div
            title="Configuración"
            className="hover:bg-slate-200 p-2 box-border rounded-full flex items-center justify-center -mt-[0.3rem] duration-200"
          >
            <FiSettings
              size={38}
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            />
          </div>
          <div
            title="Cerrar sesion"
            className="hover:bg-slate-200 p-2 box-border rounded-full flex items-center justify-center -mt-[0.3rem] duration-200"
          >
            <FiLogOut
              size={38}
              className="cursor-pointer"
              onClick={handleSignout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
