import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from './MenuData.module.css'
export function MenuData(props){
  const navigate = useNavigate();
  const location = useLocation();
  const [topTab, setTopTab] = useState(null); // 현재 활성화된 탭을 추적

  useEffect(() => {
    const tabstate = JSON.parse(localStorage.getItem('tabState'));
    setTopTab(tabstate);
    
    // 경로에 따른 상태 초기화
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/category') {
      localStorage.removeItem('tabState');
      setTopTab(null);
    }
  }, [location]); // 두 번째 매개변수를 빈 배열로 설정하여 최초 렌더링 시에만 실행

  const menuData = [
    {
      id: 1,
      title: {
        item: '성동물산 소개',
        link: '/introduceCompany'
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
        item: '진행 중인 이벤트',
        link: '/event',
      }],
    },
    {
      id: 2,
      title: {
        item: '고객센터',
        link: '/userservice/notice'
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
      title: {
        item: '마이페이지',
        link: '/mypages',
        require : !props.login
      },
      subMenuItems: [{
        item: '내 정보 관리',
        link: '/mypages',
        require : !props.login
      },
      {
        item: '장바구니 목록',
        link: '/basket',
        require : !props.login
      },
      {
        item: '내가 찜한 목록',
        link: '/likeitem',
      },
      {
        item: '주문 / 배송 게시판',
        link: '/delivery',
        require : !props.login
      }],
    },
  ];
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

  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(menuData.map(() => false));

  function saveTab(id) {
    localStorage.setItem('tabState', JSON.stringify(id));
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
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          className={`menu-item ${subMenuStates[index] && 'open'}
          menutab-item ${topTab === item.id ? 'active' : ''}`}
          onClick={() => { saveTab(item.id) }}
        >
          <span
            className={styles.link}
            onClick={() => { 
              if(item.title.require){
                alert("로그인이 필요한 서비스입니다.");
                navigate("/login");
                return;
              } 
                navigate(`${item.title.link}`) }}>
            {item.title.item}
          </span>
          {subMenuStates[index] && (
            <ul
              className="sub-menu">
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
          )}
        </li>
      ))}
    </div>
  )
}