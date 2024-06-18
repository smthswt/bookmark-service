import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate, useNavigate,
} from "react-router-dom";
import { Layout } from "./Layout.js";
import LinksPage from "./pages/Links";
import {LoginPage} from "./pages/Login";
import Homepage from "./pages/Home";
import {PlacesPage} from "./pages/Places";
import { Redirect } from "react-router-dom"
import MyPage from "./pages/MyPage";
import {PlacesPage2} from "./pages/Places2";

const Routing = () => {
    const navigate = useNavigate()

  //   const isLoggedIn = () => {
  //   return !!localStorage.getItem('access_token');
  // };

    const RequireAuth = ({ children }) => {

    if (!localStorage.getItem('access_token')) {
        console.log("로그인 하세요")
        navigate("/");
        return null;
    }

    return children;
};


    return (
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage /> } />
                    <Route path="/home" element={<RequireAuth> <Homepage /> </RequireAuth>} />
                    <Route path="/links" element={<RequireAuth> <LinksPage /> </RequireAuth>} />
                    <Route path="/places" element={<RequireAuth> <PlacesPage /> </RequireAuth>} />
                    <Route path="/places2" element={<RequireAuth> <PlacesPage2 /> </RequireAuth>} />
                    <Route path="/profile" element={<RequireAuth> <MyPage /> </RequireAuth>} />


                </Routes>
            </Layout>
    );
};

export default Routing;