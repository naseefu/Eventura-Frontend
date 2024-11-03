import React from "react";
import { Navigate,useLocation } from "react-router-dom";
import ApiService from "./ApiService";


export const ProtectedRoute = ({element:Component})=>{
  const location = useLocation();

  return ApiService.isAuthenticated() ?(
    Component
  ):(
    <Navigate to="/login" replace state={{from:location}}/>
  );
}

export const LoggedInRoute = ({ element: Component }) => {
  const location = useLocation();
  return ApiService.isAuthenticated() ? (
    <Navigate to="/" replace state={{ from: location }} />
  ) : (
    Component
  );
};

export const AdminRoute = ({element:Component})=>{
  const location = useLocation();

  return ApiService.isAdmin() ? (
    Component
  ):(
    <Navigate to="/login" replace state={{from:location}}/>
  )
}

export const EnteredRoute = ({ children }) => {
  const location = useLocation();

  return ApiService.isEntered() ? (
    children
  ) : (
    <Navigate to="/enter-details" replace state={{ from: location }} />
  );
};
