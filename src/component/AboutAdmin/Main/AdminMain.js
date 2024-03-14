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
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <Outlet />
        <div className={styles.main}>
          {/* 상위 컴포넌트 부분 */}
          <section className={styles.top}>
            {/* 주문, 취소, 배송, 상품 */}
            <article className={styles.product}>
              <div className={styles.productSeparate}>

              </div>
              <div className={styles.productSeparate}>

              </div>
              <div className={styles.productFull}>

              </div>
              <div className={styles.productFull}>
                
              </div>
            </article>
            {/* 공지사항 */}
            <article className={styles.notice}></article>
          </section>
          {/* 하위 컴포넌트 부분 */}
          <section className={styles.bottom}>
            {/* 방문자 수 통계 */}
            <article className={styles.visitor}></article>
            {/* 유저 */}
            <article className={styles.users}></article>
          </section>
        </div>
      </div>
    </div>
  );
}
