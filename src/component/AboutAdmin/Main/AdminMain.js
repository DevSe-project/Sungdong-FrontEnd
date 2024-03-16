import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeader } from "../Layout/Header/AdminHeader";
import { AdminMenuData } from "../Layout/SideBar/AdminMenuData";
import styles from "./AdminMain.module.css";
import { useFetch } from "../../../customFn/useFetch";
import { useEffect } from "react";
export function AdminMain() {
  const { fetchServer } = useFetch();
  const navigate = useNavigate();

  const fetchVerifyAdmin = async () => {
    try {
      const data = await fetchServer({}, "post", "/auth/verify/admin", 1);
      return console.log(data.message);
    } catch (error) {
      navigate("/");
    }
  };

  useEffect(() => {
    fetchVerifyAdmin();
  }, []);


  return (
    <div className={styles.container}>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <Outlet />
      </div>
    </div>
  );
}
