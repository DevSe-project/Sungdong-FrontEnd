import logo from '../../../image/logo.jpeg'
import shortLogo from '../../../image/shortLogo.png'
import { useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import { SearchBar } from './SearchBar';
import { SeperateSearchBar } from './SeperateSearchBar';
import { CategoryBar } from './CategoryBar';
import { useModalActions, useModalState } from '../../../store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from '../../../axios';
import { useQueryClient } from '@tanstack/react-query';



export function TopBanner(props) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isModal, modalName } = useModalState();
  const { setIsModal, selectedModalClose, selectedModalOpen } = useModalActions();

  const handleLogoutFetch = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/auth/logout",
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      )
      queryClient.clear();
      alert(response.data.message);
      window.location.reload();
    } catch (error) {
      throw new Error('로그아웃 중 오류가 발생했습니다.');
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.top_container}>
        <div className={styles.top_nav}>

          {/* 1_로고 */}
          <div className={styles.logo}>
            <img className={styles.inLogo_img} onClick={() => navigate("/")} src={logo} alt="로고" height='70px' />
            <img className={styles.inLogo_shortimg} onClick={() => navigate("/")} src={shortLogo} alt="로고" height='70px' />
          </div>

          {/* 2_검색창 */}
          <div className={styles.searchBar}>
            <SearchBar />
          </div>

          {/* 3_분리된 검색창 */}
          <div className={styles.seperateSearchBar}>
            <SeperateSearchBar />
          </div>


          {/* 4_카테고리 아이콘 */}
          <div className={styles.cate_icon}>
          <li
              className='menu-item'
              onClick={() => {
                if (isModal && modalName === "categoryBar")
                  selectedModalClose("categoryBar");
                else if (!isModal && modalName === '')
                  selectedModalOpen("categoryBar");
              }}
              style={{ ...props.text_dynamicStyle }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <i style={{ fontSize: '1.2em', backgroundColor: 'none'}} className="fas fa-bookmark" /> <span className={styles.text}>카테고리</span>
              </div>
            </li>
          </div>

          {/* 5_로그인/로그아웃 */}
          <div className={styles.login}>
            <button className={styles.link_signIn} onClick={() => {
              const isLoggedIn = GetCookie('jwt_token');
              if (isLoggedIn) {
                handleLogoutFetch();
              } else {
                navigate("/login");
              }
            }}>
              {GetCookie('jwt_token')
                ? <div className={styles.align_iconNtext}>
                  <i style={{ fontSize: '1.2em' }} className="fas fa-sign-out" />
                  <span className={styles.text}>&nbsp;로그아웃</span>
                </div>
                : <div className={styles.align_iconNtext}>
                  <i style={{ fontSize: '1.2em' }} className="fas fa-sign-in" />
                  <span className={styles.text}>&nbsp;로그인</span>
                </div>
              }
            </button>
          </div>
        </div>
      </div>

      {/* 클릭하면 나오는 카테고리바 */}
      {
        isModal && modalName === "categoryBar"
          ?
            <CategoryBar category_dynamicStyle={props.category_dynamicStyle} />
          :
          null
      }

    </div>
  );
}