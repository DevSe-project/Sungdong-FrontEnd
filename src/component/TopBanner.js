import { useState } from 'react';
<<<<<<< HEAD
import logo from '../image/logo.jpeg'
import { useNavigate } from 'react-router-dom'
import styles from './TopBanner.module.css';
import SearchBar from './SearchBar';
=======
import '../App.css'
import styles from './TopBanner.module.css';
>>>>>>> 4399c62891cc561e44e6c99857ab3b043d59653e
export function TopBanner () {
  const menuData = [
    {
      title: '회사 소개',
      subMenuItems: ['오시는 길', '오늘의 소식', '서브메뉴3'],
    },
    {
      title: '문의하기',
      subMenuItems: ['질문 게시판', '1:1 상담', '실시간 채팅 게시판'],
    },
  ];
  const navigate = useNavigate();
  const [subMenuStates, setSubMenuStates] = useState(menuData.map(() => false));

  const handleMouseEnter = (index) => {
    // 해당 인덱스의 메뉴를 열기 위해 true로 설정
    const newSubMenuStates = [...subMenuStates];
    newSubMenuStates[index] = true;
    setSubMenuStates(newSubMenuStates);
  };

  const handleMouseLeave = (index) => {
    // 해당 인덱스의 메뉴를 닫기 위해 false로 설정
    const newSubMenuStates = [...subMenuStates];
    newSubMenuStates[index] = false;
    setSubMenuStates(newSubMenuStates);
  };

  return (
<<<<<<< HEAD
    <div className={styles.top_container}>
      <div className={styles.top_nav}>
        <img className={styles.image} onClick={()=>navigate("/")} src={logo} height='80px'/>
        <SearchBar/>
        {menuData.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={`menu-item ${subMenuStates[index] && 'open'}`}
          >
            <a className={styles.link} href="#">{item.title}</a>
            {subMenuStates[index] && (
              <ul className="sub-menu">
                {item.subMenuItems.map((item, index) => (
                  <li className={styles.sub_item} key={index}>
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        <button className={styles.link_signIn}>로그인</button>
      </div>
=======
  <div className={styles.topNav}>
    {menuData.map((item,index)=>(
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`main-menu-item ${isSubMenuOpen ? 'open' : ''}`}
    >
      <a className={styles.link} ref="#">{item.title}</a>
      {isSubMenuOpen && (
        <ul className={styles.subMenu}>
          {item.subMenuItems.map((item, index) => (
            <li key={index}>
              <a href="#">{item}</a>
            </li>
          ))}
        </ul>
      )}
    </li>
    ))}
      {/* 오늘의 소식 */}
      {/* 이달의 이벤트 */}
      <nav className={styles.topNav}>
        <div>
          <a className={styles.link} href="">이달의 이벤트</a>
        </div>
      </nav>
      {/* 문의하기 */}
      <nav className={styles.topNav}>
        <div>
          <a className={styles.link}  href="">문의하기</a>
        </div>
      </nav>
      {/* 로그인 */}
      <nav className={styles.topNav}>
        <div className={styles.topDiv}>
          <a className={styles.linkSignIn} href="">로그인</a>
        </div>
      </nav>
>>>>>>> 4399c62891cc561e44e6c99857ab3b043d59653e
    </div>
  );
}