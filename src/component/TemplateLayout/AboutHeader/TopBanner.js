import logo from '../../../image/logo.jpeg'
import shortLogo from '../../../image/shortLogo.png'
import { useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import { SearchBar } from './SearchBar';
import { SeperateSearchBar } from './SeperateSearchBar';
import { CategoryBar } from './CategoryBar';
import { useIsLogin, useSetLogin } from '../../../Store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from '../../../axios';
import { useQueryClient } from '@tanstack/react-query';
//상단 메뉴 리스트 
export function TopBanner(props) {
  const navigate = useNavigate();
  const isLogin = useIsLogin();
  const {setLogin} = useSetLogin();
  const queryClient = useQueryClient();

  const handleLogoutFetch = async() => {
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
      // 성공 시 추가된 상품 정보를 반환합니다.
    } catch (error) {
        // 실패 시 예외를 throw합니다.
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
              onClick={props.iconOnClick}
              style={{ ...props.text_dynamicStyle }}
              onMouseEnter={props.iconMouseEnter}
              onMouseLeave={props.iconMouseLeave}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
                <i style={{ fontSize: '1.2em' }} className="fas fa-bookmark" /> <span className={styles.text}>카테고리</span>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <div className={styles.categoryBar}>
          <CategoryBar selectedCategory={props.selectedCategory} setSelectedCategory={props.setSelectedCategory} selectedSubCategory={props.selectedSubCategory} setSelectedSubCategory={props.setSelectedSubCategory} category_dynamicStyle={props.category_dynamicStyle} />
        </div>
      </div>
    </div>
  );
}