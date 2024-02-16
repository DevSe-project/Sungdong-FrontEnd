import { Outlet } from 'react-router-dom'
import { AdminHeader } from '../Layout/Header/AdminHeader'
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData'
import styles from './AdminMain.module.css'
import { useFetch } from '../../../customFn/useFetch'
import { useEffect } from 'react'
export function AdminMain() {

  const { fetchServer } = useFetch();

  const fetchVerifyAdmin = async () => {
    const data = await fetchServer({}, 'post', '/auth/verify/admin', 1);
    return alert(data.message);
  }

  useEffect(() => {
    fetchVerifyAdmin();
  }, [])

  return (
    <div>
      <AdminHeader />
      <div className={styles.body}>
        <AdminMenuData />
        <Outlet />
      </div>
    </div>
  )
}