import { Outlet } from 'react-router-dom'
import { AdminHeader } from '../Layout/Header/AdminHeader'
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData'
import styles from './AdminMain.module.css'
export function AdminMain() {
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