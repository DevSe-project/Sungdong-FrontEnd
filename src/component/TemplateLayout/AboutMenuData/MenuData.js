import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './MenuData.module.css'
export function MenuData(props){
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
        item: '성동물산 소개',
      },
      subMenuItems: [{
        item: '기업 소개',
        link: '/introduceCompany'
      },
      {
        item: '오시는 길',
        link: '/comeway',
      },
      {
        item: '오늘의 뉴스',
        link: '/todaytopic/1',
      },
      {
        item: '이벤트',
        link: '/event',
      }],
    },
    {
      id: 2,
      title: {
        item: '고객센터',
      },
      subMenuItems: [
        {
          item: '공지사항',
          link: '/userservice/notice',
        },
        {
          item: '문의하기',
          link: '/userservice/ask',
          require : !props.login
        }
      ],
    },
    {
      id: 3,
      icon : <i style={{fontSize: '1.2em'}} className="fas fa-heart-circle"/>,
      title: {
        item: '마이페이지',
      },
      subMenuItems: [
        {
          item: '내 정보 관리',
          link: '/mypages',
          require : !props.login
        },
        {
          item: '원장조회',
          link: '/mypages',
          require : !props.login
        },
        {
          item: '입금내역',
          link: '/mypages',
          require : !props.login
        },
        {
          item: '세금계산서',
          link: '/mypages',
          require : !props.login
        }
      ],
    },
    {
      id: 4,
      icon : <i style={{fontSize: '1.2em'}} className="fa fa-shopping-basket"/>,
      title: {
        item: '주문하기',
      },
      subMenuItems: [    
        {
          item: '찜 목록',
          link: '/likeitem',
        },
        {
          item: '장바구니 목록',
          link: '/basket',
          require : !props.login
        },
        {
          item: '주문/배송 현황',
          link: '/delivery',
          require : !props.login
        },
      ],
    },
    {
      id: 5,
      icon : <i style={{fontSize: '1.2em'}} className="fas fa-boxes"></i>,
      title: {
        item: '배송관련',
      },
      subMenuItems: [        
        {
          item: '주문/배송 현황',
          link: '/delivery',
          require : !props.login
        },
        {
          item: '배송 조회',
          link: '/delivery',
          require : !props.login
        },
        {
          item: '미발송 조회',
          link: '/delivery',
          require : !props.login
        },

      ],
    },
    {
      id: 6,
      title: {
        item: '견적하기',
      },
      subMenuItems: [{
        item: '견적함',
        link: '/mypages',
        require : !props.login
      },
      {
        item: '견적관리',
        link: '/mypages',
        require : !props.login
      }
      ]
    },
    {
      id: 7,
      title: {
        item: '반품/수리/AS',
      },
      subMenuItems: [{
        item: '반품신청',
        link: '/mypages',
        require : !props.login
      },
      {
        item: '반품조회',
        link: '/mypages',
        require : !props.login
      },
      {
        item: '불량교환신청',
        link: '/mypages',
        require : !props.login
      },
      {
        item: '불량교환조회',
        link: '/mypages',
        require : !props.login
      },
      {
        item: 'A/S신청, 조회',
        link: '/mypages',
        require : !props.login
      },
      ]
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
            className={styles.link}
            onClick={() => { 
              if(item.title.require){
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              } 
            }}>
            {item.title.item}
          </span>
          {subMenuStates[index] === true &&
            <ul
              className={styles.subMenu}
              >
              {item.subMenuItems.map((subMenuItem, subMenuItemindex) => (
                <li
                  onClick={() => {
                    if(subMenuItem.require){
                      alert("로그인이 필요한 서비스입니다.");
                      navigate("/login");
                      return;
                    } 
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