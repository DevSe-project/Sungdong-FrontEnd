import { useState } from 'react';
import styles from './Tab.module.css'
export function Tab(props){
  // 탭 부분
  const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 탭을 추적하는 상태
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const tabItems = [
    { id: 1, title: '상세정보' },
    { id: 2, title: '리뷰' },
    { id: 3, title: 'Q & A' },
    { id: 4, title: '반품 / 교환정보' },
  ];
  return(
    <div>
      <div className={styles.tabnav}>
        {tabItems.map((item) => (
          <a
            href={`#${item.id}`}
            key={item.id}
            className={`tab-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => {handleTabClick(item.id)}}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  )
}