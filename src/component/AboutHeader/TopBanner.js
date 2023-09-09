import { useEffect, useState } from 'react';
import logo from '../../image/logo.jpeg'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import { SearchBar } from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CategoryBar } from './CategoryBar';
import { MenuData } from './MenuData';
//상단 메뉴 리스트 
export function TopBanner(props) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={styles.body}>
      <div className={styles.top_container}>
        <div className={styles.top_nav}>
          {/* 카테고리 박스 */}
          <div
            className={styles.categoryBox}
            onMouseEnter={props.iconMouseEnter}
            onMouseLeave={props.iconMouseLeave}
            onClick={props.menuOnClick}
          >
            {/* 카테고리 아이콘 */}
            <FontAwesomeIcon
              icon={faBars} // 사용할 FontAwesome 아이콘 선택
              style={{ ...props.icon_dynamicStyle }}
              className={styles.categoryIcon}
            />
          </div>
          {/* 로고 */}
          <img className={styles.image} onClick={() => navigate("/")} src={logo} alt="로고" height='70px' />
          {/* 서치바 */}
          <SearchBar data={props.data} setData={props.setData}/>
          <li
            className='menu-item'
            onClick={props.iconOnClick}
            style={{...props.text_dynamicStyle}}
            onMouseEnter={props.iconMouseEnter}
            onMouseLeave={props.iconMouseLeave}
          >
            카테고리
          </li>
          <li>
            배송 현황
          </li>
          <li>
            찜하기
          </li>
          <li>
            장바구니
          </li>
          {/* 로그인/로그아웃 */}
          <button className={styles.link_signIn} onClick={() => {
            if(props.login){
              sessionStorage.removeItem('saveLoginData');
              props.setLogin(false);
              window.location.reload();
            } else {
              navigate("/login");
            }}}>{props.login ? '로그아웃' : '로그인'}
          </button>
        </div>
      </div>
      
      {/* 클릭하면 나오는 카테고리바 */}
      <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
        <div className={styles.menuBar}>
          <MenuData menu_dynamicStyle={props.menu_dynamicStyle}/>
        </div>
        <div className={styles.categoryBar}>
          <CategoryBar selectedCategory={props.selectedCategory} setSelectedCategory={props.setSelectedCategory} selectedSubCategory={props.selectedSubCategory} setSelectedSubCategory={props.setSelectedSubCategory} data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} category_dynamicStyle={props.category_dynamicStyle}/>
        </div>
      </div>
    </div>
  );
}