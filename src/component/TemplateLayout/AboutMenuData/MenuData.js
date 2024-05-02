import { useEffect, useState } from "react";
import { NavLink, useLocation, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import styles from './MenuData.module.css'
import { GetCookie } from "../../../customFn/GetCookie";
import WelcomeModule from "../../WelcomeModule/WelcomeModule";
export function MenuData(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;
  // const { pathname, search, hash } = useResolvedPath(to);
  // const match = useMatch({ path: pathname, end: true });
  

  const menuData = [
    {
      id: 1,
      title: {
        item: '회원 정보'
      },
      subMenuItems: [
        {
          item: '내 정보 관리',
          link: '/mypages',
          require: GetCookie('jwt_token') !== null
        }
      ]
    },
    // {
    //   id: 2,
    //   icon: <i style={{ fontSize: '1.2em' }} className="fas fa-heart-circle" />,
    //   title: {
    //     item: '마이페이지',
    //   },
    //   subMenuItems: [
    //     // {
    //     //   item: '원장조회',
    //     //   link: '/accountBook',
    //     //   require: GetCookie('jwt_token') !== null
    //     // },
    //     // {
    //     //   item: '입금내역',
    //     //   link: '/depositHistory',
    //     //   require: GetCookie('jwt_token') !== null
    //     // },
    //     {
    //       item: '세금계산서',
    //       link: 'outLink',
    //     },

    //   ],
    // },
    {
      id: 2,
      title: {
        item: '장바구니',
        link: '/basket',
      },
      require: GetCookie('jwt_token') !== null
    },
    {
      id: 3,
      icon: <i style={{ fontSize: '1.2em' }} className="fa fa-shopping-basket" />,
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
          require: GetCookie('jwt_token') !== null
        },
        {
          item: '주문/배송 현황',
          link: '/delivery',
          require: GetCookie('jwt_token') !== null
        },
      ],
    },
    {
      id: 4,
      title: {
        item: '견적하기',
      },
      subMenuItems: [{
        item: '견적함',
        link: '/estimateBox',
        require: GetCookie('jwt_token') !== null
      },
      {
        item: '견적관리',
        link: '/estimateManager',
        require: GetCookie('jwt_token') !== null
      }
      ]
    },
    {
      id: 5,
      title: {
        item: '반품/교환',
      },
      subMenuItems: [{
        item: '반품/교환 신청',
        link: '/return/request',
        require: GetCookie('jwt_token') !== null
      },
      {
        item: '반품/교환 내역조회',
        link: '/return/list',
        require: GetCookie('jwt_token') !== null
      },
      ]
    },
    {
      id: 6,
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
          link: '/userservice/contact',
          require: GetCookie('jwt_token') !== null
        }
      ],
    },
    {
      id: 7,
      title: {
        item: '성동물산 소개',
      },
      subMenuItems: [
        {
          item: '오시는 길',
          link: '/comeway',
        },
        {
          item: '이벤트',
          link: '/event',
        }],
    },
  ];
  // 서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(Array(menuData.length).fill(false));

  function toggleSubMenu(index) {
    setSubMenuStates(prevStates => {
      const newSubMenuStates = prevStates.map((state, idx) => idx === index ? !state : false);
      return newSubMenuStates;
    });
  }

  return (
    <div
      className={styles.menuLocation}>
      <WelcomeModule />
      {/* 메뉴 loop */}
      {menuData.map((item, index) => (
        <li
          key={index}
          style={{ background: 'linear-gradient(0deg, rgb(240,240,240) 1%, rgb(255,255,255) 99%)'}}
          className={`menu-item ${item.subMenuItems ? item.subMenuItems.some((subitem) => subitem.link === current) && 'active' : item.title.link === current && 'active'}`}
          onClick={() => {
            if (item.require === false) {
              alert("로그인이 필요한 서비스입니다.");
              navigate("/login");
              return;
            }
            if (item.title.link) {
              navigate(`${item.title.link}`)
              return;
            }
            toggleSubMenu(index);
          }}
        >
          <span className={styles.link}>
            {item.title.item}
          </span>
          {(subMenuStates[index] === true || item.subMenuItems?.some((item) => item.link === current)) &&
            <ul
              className={styles.subMenu}
            >
              {item.subMenuItems.map((subMenuItem, subMenuItemindex) => (
                <NavLink
                  key={subMenuItemindex}
                  onClick={(event) => {
                    if (subMenuItem.require === false) {
                      alert("로그인이 필요한 서비스입니다.");
                      navigate("/login");
                      event.preventDefault()
                      return;
                    }
                    if (subMenuItem.link === 'outLink') {
                      window.open(`https://www.sendbill.co.kr/RESTful/main`, '_blank', 'width=1000,height=800');
                      event.preventDefault()
                      return;
                    }
                  }}
                  to={subMenuItem.link}
                  className={`${styles.sub_item} ${subMenuItem.link === current ? styles.active : ''}`}
                  >
                  {subMenuItem.item}
                </NavLink>
              ))}
            </ul>
          }
        </li>
      ))}
    </div>
  )
}