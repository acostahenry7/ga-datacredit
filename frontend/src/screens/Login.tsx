import React, { useState } from "react";
import logoFull from "../assets/ga-logo-full.png";
import sapLogo from "../assets/sap-logo.png";
import forthing from "../assets/forthing-t5.jpg";
import Button from "../components/Button";
import { LuBadgeHelp } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import useFetch from "../hooks/useFetch";
import { loginApi } from "../api/auth";
import useAuth from "../hooks/useAuth";
import { DNA } from "react-loader-spinner";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const { signin } = useAuth();

  const companyOptions = [
    { label: "Lasa Motors", value: "DB_LM" },
    { label: "Avant Auto", value: "DB_AA" },
    { label: "Gar 210", value: "DB_GA" },
    { label: "Motoplex", value: "DB_MP" },
    { label: "KTM Import", value: "DB_KI" },
    // { label: "Cycle Lab", value: "DB_CL" },
    { label: "Avant Auto TEST", value: "DB_AA_TEST02" },
  ];

  const loginForm = useFormik({
    initialValues: {
      username: "",
      password: "",
      companyDB: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      username: Yup.string().required("Introduzca su usuario"),
      password: Yup.string().required("Introduzca su contraseña"),
      companyDB: Yup.string().required("Seleccione empresa"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      loginApi(values)
        .then((response) => {
          if (response.error == true) {
            throw response;
          } else {
            signin(response.body);
          }
        })
        .catch((err) => {
          console.log(err);
          if (typeof err.body != "object") {
            setError(err.body);
          } else {
            if (err.status === 401) {
              setError("Acceso no autorizado");
            } else {
              setError("Error interno del servidor");
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col items-center tracking-tight justify-center min-h-lvh px-6 lg:px-16 w-lvw box-border">
        <img src={logoFull} width={170} height={25} />
        <h2 className="font-roboto font-semibold text-[36px] text-slate-800">
          Accede a tu cuenta
        </h2>
        <span className="font-medium lg:text-xl text-[17px] mt-2 flex items-center gap-1">
          Recuerda usar tus credenciales de{" "}
          <img src={sapLogo} alt="sapLogo" width={40} height={28} />
        </span>
        <div className="flex flex-col items-center mt-12 gap-9 w-full">
          <div className="input-wrapper">
            <input
              value={loginForm.values.username}
              onChange={(e) =>
                loginForm.setFieldValue("username", e.target.value)
              }
              className="input relative"
              type="text"
              placeholder="Usuario"
            />
            <span className="input-error">{loginForm.errors.username}</span>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              value={loginForm.values.password}
              onChange={(e) =>
                loginForm.setFieldValue("password", e.target.value)
              }
              className="input relative"
              placeholder="Contraseña"
            />
            <span className="input-error">{loginForm.errors.password}</span>
          </div>
          <div className="input-wrapper">
            <select
              value={loginForm.values.companyDB}
              onChange={(e) =>
                loginForm.setFieldValue("companyDB", e.target.value)
              }
              className="input relative text-[#828080]"
            >
              <option value="">Seleccionar empresa</option>
              {companyOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label.toUpperCase()}
                </option>
              ))}
            </select>
            <span className="input-error">{loginForm.errors.companyDB}</span>
          </div>
          <div className="input-wrapper items-center ">
            <Button
              onClick={loginForm.submitForm}
              title={"Acceder"}
              width={"100%"}
              height={55}
              variant="dark"
            />
            <div>
              <span className="font-roboto text-[14px] font-medium flex items-center gap-1 mt-2">
                No puede acceder, obtener ayuda <LuBadgeHelp />
              </span>
              {error && (
                <p className="input-error ml-0 mt-0 w-[215px] text-center">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="absolute  opacity-70">
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        )}
      </div>
      <div className="hidden lg:flex p-2">
        <div className="w-full h-full relative">
          <div className="absolute w-full h-full bg-gradient-to-b from-slate-900 via-transparent to-slate-900 rounded-tl-[50px] rounded-br-[50px] object-fill"></div>
          <img
            className="object-cover w-full h-full rounded-tl-[50px] rounded-br-[50px]"
            src={forthing}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
