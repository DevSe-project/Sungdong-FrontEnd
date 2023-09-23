import { useCallback, useEffect, useState } from 'react';
import styles from './Tab.module.css'

// 디바운싱 함수
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function Tab(){

  const [tabActive, setTabActive] = useState(0);
  const [tabOffsets, setTabOffsets] = useState([]);

  // TabOffsets (offset의 상단 값) 배열 받아오기
  const updateTabOffsets = useCallback(() => {
    const pages = Array.from(document.querySelectorAll('.tab-content'));
    setTabOffsets(pages.map(page => page.offsetTop));
  }, []);
  
  // 스크롤이 tab에 근접하게 다가가면 해당 탭 값으로 옮겨지게 하기위한 handleScroll
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const tabOffSet = [...tabOffsets];
    let closestTabIndex = 0; //근접 탭 인덱스 초기 값 설정
    let closestOffsetDiff = Math.abs(scrollTop - tabOffSet[0]); //근접 offset diff값 설정
  
    for (let i = 1; i < tabOffSet.length; i++) {
      const offsetDiff = Math.abs(scrollTop - tabOffSet[i]);
      if (offsetDiff < closestOffsetDiff) {
        closestOffsetDiff = offsetDiff;
        closestTabIndex = i;
      }
    }
    return closestTabIndex;
  }, [tabOffsets]);
  


  // 스크롤핸들러 디바운스 함수 (debounce는 분리함)
  const debouncedScrollHandler = useCallback(() => {
    const handleScrollTimeout = debounce(() => {
      const closestTabIndex = handleScroll();
      setTabActive(closestTabIndex);
    }, 10);
  
    return handleScrollTimeout;
  }, [handleScroll]);
  



  // 의존성 배열 분리를 위한 useEffect 2번 사용

  // 1. tabOffset들을 className에서 받아오는 구문
  useEffect(() => {
    updateTabOffsets();
  }, [updateTabOffsets]);

  // 2. 디바운스 스크롤 핸들러와 tabOffset들을 받아 스크롤 이벤트 진행시키는 구문
  useEffect(() => {
    const handleScrollTimeout = debouncedScrollHandler();

    window.addEventListener('scroll', handleScrollTimeout);
    window.addEventListener('resize', updateTabOffsets);

    return () => {
      window.removeEventListener('scroll', handleScrollTimeout);
      window.removeEventListener('resize', updateTabOffsets);
    };
  }, [debouncedScrollHandler, updateTabOffsets]);
  

  const tabItems = [
    { id: 1, title: '상세정보' },
    { id: 2, title: '반품 / 교환정보' },
    { id: 3, title: '관련상품' },
  ];

  return (
    <div>
      <div className={styles.tabnav}>
        {tabItems.map((item, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            key={item.id}
            className={`tab-item ${tabActive === index ? 'active' : ''}`}
            // 부드럽게 스크롤 전환
            onClick={() => window.scrollTo({ top: tabOffsets[index], behavior: 'smooth' })}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}