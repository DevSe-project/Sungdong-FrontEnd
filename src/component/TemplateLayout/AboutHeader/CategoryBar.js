import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CategoryBar.module.css'
import { useEffect, useState } from 'react';
import { useDataStore } from '../../../Store/DataStore';

export function CategoryBar(props) {
  const { categoryData } = useDataStore();
  // 선택된 카테고리 변경 핸들러 (우선순위 : 1. 소 카테고리 2. 대 카테고리)
  const handleCategoryChange = (category) => {
    // 큰 카테고리에 해당하는 탭만을 찾기위해 subCategory는 삭제
    sessionStorage.removeItem('subCategory');
    sessionStorage.removeItem('filterSearch');
    sessionStorage.setItem('category', JSON.stringify(category));
    navigate("/category");
  };
  const handleSubCategoryChange = (category) => {
    sessionStorage.removeItem('category');
    sessionStorage.removeItem('filterSearch');
    sessionStorage.setItem('subCategory', JSON.stringify(category));
    navigate("/category");
  };
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null); // 현재 활성화된 탭을 추적

  useEffect(() => {
    if(sessionStorage.getItem('filterSearch')){
      sessionStorage.removeItem('tabState');
      setActiveTab(null);
    } else {
      const tabstate = JSON.parse(sessionStorage.getItem('categoryTabState'));
      setActiveTab(tabstate);
    }

    if (location.pathname !== '/category') {
      sessionStorage.removeItem('tabState');
      setActiveTab(null);
    }
  },[location])

  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(categoryData && categoryData.map(()=>false));

  const handleTabClick = (tabItem) => {
    sessionStorage.setItem('categoryTabState', JSON.stringify(tabItem.id));
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
    <div className={styles.categoryLocation}>
      <div className={styles.categoryBarContainer} 
      //애니메이션 스타일 지정
      style={{...props.category_dynamicStyle}}>
        {/* 아이콘 hovered */}
        {
          categoryData
          ? categoryData.map((item, index) => (
            <li
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              className={`categorymenu-item ${subMenuStates[index] && 'open'} + categorytab-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { handleTabClick(item) }}
            >
              <span 
              onClick={() => handleCategoryChange(item.title)}
              >
                {item.title}
              </span>
              {/* 서브메뉴 loop */}
              {subMenuStates[index] && (
                <ul onMouseLeave={() => handleMouseLeave(index)} className="sub-menu">
                  {item.subMenuItems.map((item, index) => (
                    <li onClick={() => handleSubCategoryChange(item.item)} className={styles.category} key={index}>
                      {item.item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        : '로딩중'}
      </div>
    </div>
  )
}