import { createContext, useEffect, useMemo, useState } from "react";

type session = {
  userData: {
    LastLoginTime?: string;
    UserCode?: string;
    UserName?: string;
    // El API de auth ha devuelto este campo en ambas grafías, por eso se
    // aceptan las dos y se normaliza en `companySchema`.
    CompanyDB?: string;
    companyDB?: string;
    eMail?: string;
  };
};

// Esquema de la empresa con la que se inició sesión (ej. "DB_LM").
// Es el que deben usar todas las consultas para no leer datos de otra empresa.
function getCompanySchema(session: session | null): string | null {
  return session?.userData?.CompanyDB ?? session?.userData?.companyDB ?? null;
}

const AuthContext = createContext({
  session: null as session | null,
  companySchema: null as string | null,
  signin: (_sessionData: any) => {},
  signout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<session | null>(null);

  useEffect(() => {
    const sessionData = sessionStorage.getItem("SESSION");
    if (sessionData) {
      setSession(JSON.parse(sessionData));
    }
  }, []);

  const signin = (sessionData: any) => {
    sessionStorage.setItem("SESSION", JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const signout = () => {
    sessionStorage.removeItem("SESSION");
    setSession(null);
  };

  const companySchema = useMemo(() => getCompanySchema(session), [session]);

  return (
    <AuthContext.Provider value={{ session, companySchema, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
