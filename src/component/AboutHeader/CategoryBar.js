import { useNavigate } from 'react-router-dom';
import styles from './CategoryBar.module.css'
import { useState } from 'react';

export function CategoryBar(props) {

  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(props.categoryData && props.categoryData.map(()=>false));
  const [activeTab, setActiveTab] = useState(0); // 현재 활성화된 탭을 추적하는 상태

  const handleTabClick = (tabItem) => {
    setActiveTab(tabItem.id);
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

  return (
    // 좌에서 우로 밀려오는 애니메이션 스타일 지정
    <div className={styles.categoryBarContainer} 
    style={{...props.category_dynamicStyle}}>
      {/* 아이콘 hovered */}
      {
        props.categoryData
        ? props.categoryData.map((item, index) => (
          <li
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            className={`categorymenu-item ${subMenuStates[index] && 'open'} + categorytab-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { handleTabClick(item) }}
          >
            <span onClick={() => navigate(item.link)}>{item.title}</span>
            {/* 서브메뉴 loop */}
            {subMenuStates[index] && (
              <ul onMouseLeave={() => handleMouseLeave(index)} className="sub-menu">
                {item.subMenuItems.map((item, index) => (
                  <li onClick={() => navigate(`${item.link}`)} className={styles.category} key={index}>
                    {item.item}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))
      : '로딩중'}
    </div>
  )
}