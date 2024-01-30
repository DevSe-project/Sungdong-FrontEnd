import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CategoryBar.module.css'
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function CategoryBar(props) {
  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });
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
    if (sessionStorage.getItem('filterSearch')) {
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
  }, [location])

  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(categoryData?.length > 0 ? categoryData.map(() => false) : []);

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

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.customModalOverlay}>
      <div className={styles.customModalContainer}>
        <div className={styles.categoryBarContainer}
          style={{ ...props.category_dynamicStyle }}>
          {/* 아이콘 hovered */}
          {
            categoryData.length > 0
              ? categoryData.map((item, index) =>
                item.parentsCategory_id === null &&
                (
                  <li
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => handleMouseLeave(index)}
                    className={`categorymenu-item ${subMenuStates[index] && 'open'} + categorytab-item ${activeTab === item.category_id ? 'active' : ''}`}
                    onClick={() => { handleTabClick(item) }}
                  >
                    <span
                      onClick={() => handleCategoryChange(item.category_id)}
                    >
                      {item.name}
                    </span>
                    {/* 서브메뉴 loop */}
                    {subMenuStates[index] && (
                      <ul onMouseLeave={() => handleMouseLeave(index)} className="sub-menu">
                        {categoryData && categoryData
                          .filter((category) => category.parentsCategory_id === item.category_id)
                          .map((category, subIndex) => (
                            <li
                              onClick={() => handleSubCategoryChange(category.item)} // 수정: item 대신 category.item을 사용
                              className={styles.category}
                              key={subIndex} // 수정: index 대신 subIndex를 사용
                            >
                              {category.name}
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))
              : '로딩중'}
        </div>
      </div>
    </div>
  )
}