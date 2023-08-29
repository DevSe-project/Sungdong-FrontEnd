import { useEffect, useState } from 'react';
import styles from './Tab.module.css'
export function Tab(){
  const [tabActive, setTabActive] = useState(0); // 초기값은 0
  const [tabOffsets, setTabOffsets] = useState([]);
  
  useEffect(() => {
    const Page__updateOffsetTop = () => {
      const pageOffsets = [];
      const pages = document.querySelectorAll('.tab-content');
      pages.forEach((page) => {
        const offsetTop = page.offsetTop;
        page.dataset.offsetTop = offsetTop;
        pageOffsets.push(offsetTop);
      });
      return pageOffsets;
    };
  
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      let activeTabIndex = tabOffsets.length - 1;
      for (let i = tabOffsets.length - 1; i >= 0; i--) {
        const offsetTop = tabOffsets[i];
        if (scrollTop >= offsetTop) {
          activeTabIndex = i;
          break;
        }
      }
      setTabActive(activeTabIndex);
    };
  
    const pageOffsets = Page__updateOffsetTop();
    setTabOffsets(pageOffsets);
    handleScroll();
  
    const handleScrollEvent = () => {
      handleScroll();
    };
    const handleResizeEvent = () => {
      const updatedOffsets = Page__updateOffsetTop();
      setTabOffsets(updatedOffsets);
      handleScroll();
    };
  
    window.addEventListener('scroll', handleScrollEvent);
    window.addEventListener('resize', handleResizeEvent);
  
    return () => {
      window.removeEventListener('scroll', handleScrollEvent);
      window.removeEventListener('resize', handleResizeEvent);
    };
  }, []);

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