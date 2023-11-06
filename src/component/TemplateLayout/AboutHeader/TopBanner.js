import { useEffect, useState } from 'react';
import logo from '../../../image/logo.jpeg'
import shortLogo from '../../../image/shortLogo.png'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import { SearchBar } from './SearchBar';
import { SeperateSearchBar} from './SeperateSearchBar';
import { CategoryBar } from './CategoryBar';
//상단 메뉴 리스트 
export function TopBanner(props) {
  const navigate = useNavigate();

  return (
    <div className={styles.body}>
      <div className={styles.top_container}>
        <div className={styles.top_nav}>
          {/* 로고 */}
          <img className={styles.image} onClick={() => navigate("/")} src={logo} alt="로고" height='70px' />
          <img className={styles.shortimage} onClick={() => navigate("/")} src={shortLogo} alt="로고" height='70px' />
          {/* 검색창 */}
          <SearchBar/>
          {/* 분리된 검색창 */}
          <SeperateSearchBar/>
          {/* 카테고리 아이콘 */}
          <li
            className='menu-item'
            onClick={props.iconOnClick}
            style={{...props.text_dynamicStyle}}
            onMouseEnter={props.iconMouseEnter}
            onMouseLeave={props.iconMouseLeave}
          >
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5em'}}>
            <i style={{fontSize: '1.2em'}} className="fas fa-bookmark"/> <span className={styles.text}>카테고리</span>
          </div>
          </li>
          {/* 로그인/로그아웃 */}
          <button className={styles.link_signIn} onClick={() => {
            if(props.login){
              sessionStorage.removeItem('saveLoginData');
              props.setLogin(false);
              window.location.reload();
            } else {
              navigate("/login");
            }}}>
            { props.login 
            ? <div>
                <i style={{fontSize: '1.2em'}} className="fas fa-sign-out"/> 
                <span className={styles.text}>&nbsp;로그아웃</span>
              </div> 
            : <div>
                <i style={{fontSize: '1.2em'}} className="fas fa-sign-in"/> 
                <span className={styles.text}>&nbsp;로그인</span>
              </div>
            }
          </button>
        </div>
      </div>
      
      {/* 클릭하면 나오는 카테고리바 */}
      <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
        <div className={styles.categoryBar}>
          <CategoryBar selectedCategory={props.selectedCategory} setSelectedCategory={props.setSelectedCategory} selectedSubCategory={props.selectedSubCategory} setSelectedSubCategory={props.setSelectedSubCategory} category_dynamicStyle={props.category_dynamicStyle}/>
        </div>
      </div>
    </div>
  );
}