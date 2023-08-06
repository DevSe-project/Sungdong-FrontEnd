import { useNavigate } from 'react-router-dom';
import '../App.css'
import styles from './CategoryBar.module.css'
import { useState } from 'react';

export function CategoryBar() {
  const menuData = [
    {
      id : 1,
      title: '생활/건강',
      subMenuItems: [{
        item : '질문 게시판',
        link : '/question',
        },
        {
        item : '1:1 상담',
        link : '/oneandone',
        },
        {
        item : '실시간 채팅 게시판',
        link : '/chat',
      }],
    },
    {
      id : 2,
      title: '디지털/가전',
      subMenuItems: [{
        item : '질문 게시판',
        link : '/question',
        },
        {
        item : '1:1 상담',
        link : '/oneandone',
        },
        {
        item : '실시간 채팅 게시판',
        link : '/chat',
      }],
    },
    {
      id : 3,
      title: '스포츠/레저',
      subMenuItems: [{
        item : '질문 게시판',
        link : '/question',
        },
        {
        item : '1:1 상담',
        link : '/oneandone',
        },
        {
        item : '실시간 채팅 게시판',
        link : '/chat',
      }],
    },
    {
      id : 4,
      title: '패션의류',
      subMenuItems: [{
        item : '질문 게시판',
        link : '/question',
        },
        {
        item : '1:1 상담',
        link : '/oneandone',
        },
        {
        item : '실시간 채팅 게시판',
        link : '/chat',
      }],
    },
    {
      id : 5,
      title: '패션잡화',
      subMenuItems: [{
        item : '질문 게시판',
        link : '/question',
        },
        {
        item : '1:1 상담',
        link : '/oneandone',
        },
        {
        item : '실시간 채팅 게시판',
        link : '/chat',
      }],
    },
  ];
  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(menuData.map(()=>false));
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 탭을 추적하는 상태

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

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

// 전체 레이아웃 완성 후 state로 category name을 가변적으로 할 예정
  return(
    <div>
      <div className={styles.categoryBarContainer}>
        {/* 메뉴 loop */}
        {menuData.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={`categorymenu-item ${subMenuStates[index] && 'open'} + categorytab-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {handleTabClick(item.id)}}
          >
            <span className={styles.link} href="#">{item.title}</span>
            {subMenuStates[index] && (
              <ul onMouseLeave={() => handleMouseLeave(index)} className="sub-menu">
                {item.subMenuItems.map((item, index) => (
                  <li onClick={()=>navigate(`${item.link}`)} className={styles.category} key={index}>
                    {item.item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </div>
    </div>
  )
}