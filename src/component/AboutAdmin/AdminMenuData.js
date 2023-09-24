import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './AdminMenuData.module.css'
export function AdminMenuData(props){
  const navigate = useNavigate();
  const location = useLocation();
  const [topTab, setTopTab] = useState(null); // 현재 활성화된 탭을 추적

  useEffect(() => {
    const tabstate = JSON.parse(sessionStorage.getItem('tabState'));
    setTopTab(tabstate);
    // 경로에 따른 상태 초기화
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/category') {
      sessionStorage.removeItem('tabState');
      setTopTab(null);
    }
  }, [location]); // 두 번째 매개변수를 빈 배열로 설정하여 최초 렌더링 시에만 실행

  const menuData = [
    {
      id: 1,
      title: {
        item: '상품 관리',
      },
      subMenuItems: [{
        item: '상품 등록',
        link: '/adminMain/adminDetail'
      },
      {
        item: '상품 조회 / 수정',
        link: '/Admin/productList'
      },
      {
        item: '카테고리 관리',
        link: '/event',
      }],
    },
    {
      id: 2,
      title: {
        item: '주문 / 배송',
      },
      subMenuItems: [
        {
          item: '공지사항',
          link: '/userservice/notice',
        },
        {
          item: '문의하기',
          link: '/userservice/ask',
        }
      ],
    },
    {
      id: 3,
      title: {
        item: '판매 현황',
      },
      subMenuItems: [{
        item: '내 정보 관리',
        link: '/mypages',
      }],
    },
  ];

  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState([menuData.map(() => false)]);

  function saveTab(id) {
    sessionStorage.setItem('tabState', JSON.stringify(id));
  }

  function toggleSubMenu(index) {
    const newSubMenuStates = Array.from({ length: menuData.length }, () => false); // 모든 서브메뉴를 닫도록 초기화
    // subMenuStates 배열의 해당 인덱스의 값을 반전시킴
    newSubMenuStates[index] = !newSubMenuStates[index];
    setSubMenuStates(newSubMenuStates);
  }

  return(
    <div
    style={props.menu_dynamicStyle} 
    className={styles.menuLocation}>
    {/* 메뉴 loop */}
      {menuData.map((item, index) => (
        <li
          key={index}
          id={item.id}  // data-id 속성을 사용하여 탭의 id를 저장
          style={{ boxShadow: `0px 2px 4px 1px rgba(0, 0, 0, 0.2)`}}
          className={`menu-item
          menutab-item ${topTab === item.id ? 'active' : ''}`}
          onClick={() => { 
            saveTab(item.id)
            toggleSubMenu(index) 
          }}
          
        >
          <span
            className={styles.link}>
            {item.title.item}
          </span>
          {subMenuStates[index] === true &&
            <ul
              className={styles.subMenu}
              >
              {item.subMenuItems.map((subMenuItem, subMenuItemindex) => (
                <li
                  onClick={() => {
                    navigate(`${subMenuItem.link}`)
                  }}
                  className={styles.sub_item}
                  key={subMenuItemindex}>
                  {subMenuItem.item}
                </li>
              ))}
            </ul>
          }
        </li>
      ))}
    </div>
  )
}