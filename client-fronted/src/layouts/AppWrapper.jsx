

import { useEffect } from "react";
import AOS from "aos";
import { loadUserFromStorage } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { fetchAllCategory } from "../features/category/categorySlice";
import { fetchRoles } from "../features/roles/roleSlice";

export default function AppWrapper({ children }) {
  const dispatch = useDispatch();
 

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-in-out",
    });
    dispatch(loadUserFromStorage());
  }, []);





  useEffect(()=>
  {
    dispatch(fetchRoles());

  },[dispatch])

 



  

  return (
    <>
    
    {children}
    </>
    
  );
}
