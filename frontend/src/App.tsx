import "./App.css";

//import Home from "./screens/Home";
import Login from "./screens/Login";
import Nav from "./components/Nav";
import useAuth from "./hooks/useAuth";
import { getCompanyNameBySchema } from "./helpers/uiFormat";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./screens/Home";

function App() {
  const { session, companySchema } = useAuth();

  if (!session) {
    console.log("go login");

    return <Login />;
  }

  return (
    <div className="padding-wide overflow-hidden" style={{ zoom: "95%" }}>
      <BrowserRouter>
        <Nav
          companyName={getCompanyNameBySchema(companySchema)}
          userName={session.userData?.UserName}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          {/*<Route path="/settings" element={<Configuration />} />
          <Route path="/settings/brands" element={<Brands />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
