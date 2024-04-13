import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from './AdminMenuData.module.css'
export function AdminMenuData(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;
  const menuData = [
    {
      id: 0,
      title: {
        item: '상품 관리',
      },
      subMenuItems: [{
        item: '상품 등록',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/addProduct'
      },
      {
        item: '상품 조회/수정',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/searchProduct'
      },
      {
        item: '카테고리 관리',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/category',
      }],
    },
    {
      id: 1,
      title: {
        item: '주문 관리',
      },
      subMenuItems: [
        {
          item: '미결제/결제완료',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/sold',
        },
        {
          item: '취소요청/취소',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/yetPay',
        },
        {
          item: '반품/교환 관리',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/refund'
        }
      ],
    },
    {
      id: 2,
      title: {
        item: '배송 관리',
      },
      subMenuItems: [
        {
          item: '배송 상태 관리',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/SD_Delivery/Delivery',
        },],
    },
    // {
    //   id: 3,
    //   title: {
    //     item: '정산 관리',
    //   },
    //   subMenuItems: [{
    //     item: 'CMS 정산',
    //     link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/SD_account/cms'
    //   },
    //   {
    //     item: '누적 정산',
    //     link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/SD_account/total'
    //   }],
    // },
    {
      id: 3,
      title: {
        item: '알림 관리',
      },
      subMenuItems: [
        {
          item: '공지사항',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/customerCenter/notice'
        },
        {
          item: '이벤트 관리',
          link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/event'
        },
      ],
    },
    {
      id: 4,
      title: {
        item: '고객 관리',
      },
      subMenuItems: [{
        item: '고객사 관리',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/doneusers'
      },
      {
        item: '가입 대기 고객',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/holdusers'
      },
      {
        item: '회원가입 코드 관리',
        link: '/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/printCode'
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
      {/* 메뉴 loop */}
      {menuData.map((item, index) => (
        <li
          key={index}
          id={item.id}  // data-id 속성을 사용하여 탭의 id를 저장
          style={{ boxShadow: `0px 2px 4px 1px rgba(0, 0, 0, 0.2)` }}
          className={`admin-menuItem ${item.subMenuItems ? item.subMenuItems.some((subitem) => subitem.link === current) && 'active' : item.title.link === current && 'active'}`}
          onClick={() => {
            toggleSubMenu(index)
          }}

        >
          <span
            className={styles.link}>
            {item.title.item}
          </span>
          {(subMenuStates[index] === true || item.subMenuItems?.some((item) => item.link === current)) &&
            <ul
              className={styles.subMenu}
            >
              {item.subMenuItems.map((subMenuItem, subMenuItemindex) => (
                <NavLink
                onClick={() => {
                    navigate(`${subMenuItem.link}`)
                  }}
                  to={subMenuItem.link}
                  className={`${styles.sub_item} ${subMenuItem.link === current ? styles.active : ''}`}
                  key={subMenuItemindex}>
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