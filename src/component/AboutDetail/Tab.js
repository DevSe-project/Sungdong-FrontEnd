import { useEffect, useRef, useState } from 'react';
import styles from './Tab.module.css'
export function Tab(){
  const [tabActive, setTabActive] = useState(0); // 초기값은 0
  const [tabOffsets, setTabOffsets] = useState([]);
  
    useEffect(() => {
    // 각 페이지의 offsetTop 속성을 업데이트
    const Page__updateOffsetTop = () => {
      const pageOffsets = [];
      const pages = document.querySelectorAll('.tab-content');
      pages.forEach((page) => {
        const offsetTop = page.offsetTop;
        page.dataset.offsetTop = offsetTop;
        pageOffsets.push(offsetTop);
      });
      setTabOffsets(pageOffsets);
    };

    // 스크롤이 발생할 때 인디케이터 상태 갱신
    const handleScroll = () => {
      const scrollTop = window.scrollY;

      for (let i = tabOffsets.length - 1; i >= 0; i--) {
        const offsetTop = tabOffsets[i];
        if (scrollTop >= offsetTop) {
          setTabActive(i);
          break;
        }
      }
    };

    // 초기화 함수 실행
    Page__updateOffsetTop();
    handleScroll(); // 초기 스크롤 위치에 따른 초기 인디케이터 상태 설정

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', Page__updateOffsetTop);

    // 이벤트 리스너 해제 (cleanup)
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', Page__updateOffsetTop);
    };
  }, [tabOffsets]);

  const tabItems = [
    { id: 1, title: '상세정보' },
    { id: 2, title: '리뷰' },
    { id: 3, title: 'Q & A' },
    { id: 4, title: '반품 / 교환정보' },
  ];

  return (
    <div>
      <div className={styles.tabnav}>
        {tabItems.map((item, index) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            key={item.id}
            className={`tab-item ${tabActive === index ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: tabOffsets[index], behavior: 'smooth' })}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}