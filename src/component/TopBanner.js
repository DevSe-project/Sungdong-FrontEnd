import { useState } from 'react';
import '../App.css'
import './TopBanner.css';
export function TopBanner () {
  const menuData = [
    {
      title: '메뉴1',
      subMenuItems: ['서브메뉴1', '서브메뉴2', '서브메뉴3'],
    },
    {
      title: '메뉴2',
      subMenuItems: ['서브메뉴4', '서브메뉴5', '서브메뉴6'],
    },
    // 추가 메뉴들
  ];
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
    const handleMouseEnter = () => {
      setSubMenuOpen(true);
    };
  
    const handleMouseLeave = () => {
      setSubMenuOpen(false);
    };
  return (
  <div className='top_nav'>
    {menuData.map((item,index)=>(
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`main-menu-item ${isSubMenuOpen ? 'open' : ''}`}
    >
      <a className='link' href="#">{item.title}</a>
      {isSubMenuOpen && (
        <ul className="sub-menu">
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
      <nav className='top_nav'>
        <div>
          <a className='link' href="">이달의 이벤트</a>
        </div>
      </nav>
      {/* 문의하기 */}
      <nav className='top_nav'>
        <div>
          <a className='link'  href="">문의하기</a>
        </div>
      </nav>
      {/* 로그인 */}
      <nav className='top_nav'>
        <div className='top_div'>
          <a className='link_signIn' href="">로그인</a>
        </div>
      </nav>
    </div>
  )
}