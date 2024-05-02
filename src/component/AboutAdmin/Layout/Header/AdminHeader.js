import styles from './AdminHeader.module.css'
import logo from '../../../../image/logo.jpeg';
import { AdminHeaderSearchBar } from './AdminHeaderSearchBar'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function AdminHeader() {
  const [filterModal, setFilterModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <div className={styles.background}>
        {/* Left - 로고 */}
        <img style={{ cursor: 'pointer' }} src={logo} alt='로고' height='70px' onClick={() => navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/main")} />

        {/* Center - 검색창 */}
        <AdminHeaderSearchBar />


        {/* Right - 아이콘 및 필터 */}
        <div style={{ display: 'flex', gap: '2em', alignItems: 'center' }}>

          {/* Store로 링크(고객페이지) */}
          <i className="fa-solid fa-shop"
            style={{ cursor: 'pointer', fontSize: '28px', color: 'rgb(50, 50, 50)' }}
            onClick={() => { navigate('/') }}></i>

          {/* 필터 */}
          <div
            onClick={() => setFilterModal(!filterModal)}
            className={styles.searchFilter}>
            Admin
            <i
              style={{ color: 'black', fontWeight: 'bold' }}
              className={filterModal
                ? 'fas fa-angle-up'
                : 'fas fa-angle-down'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}