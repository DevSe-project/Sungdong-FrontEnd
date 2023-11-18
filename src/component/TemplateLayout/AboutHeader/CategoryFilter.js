import React from 'react';
import styles from './CategoryFilter.module.css';

export function CategoryFilter({categoryFilter, prevContentClick, handleCategoryClick}){
  //const { isLoading, isError, error, data:categoryData } = useQuery({queryKey:['search']});

  return(
    <div>
      <div className={styles.filterUI}>
        {/* categoryData.categories.map((item, key)) => */}
        {categoryFilter.map((item, key) =>
        <React.Fragment key={key}>
        {/* 필터 별 라벨 */}
        <div className={styles.label}>
          {item.label}
        </div>
        <div className={styles.content}>
          {/* 상위 카테고리 항목 */}
          {item.prevContent &&
          <>
          <span
            className={styles.contentItem}
            onClick={()=> {
              prevContentClick();
            }}>
            {item.prevContent}
          </span>
          <i className="far fa-chevron-right"/>
          </>
          }
          {/* 하위 카테고리 항목 */}
          {item.content && Array.isArray(item.content)
          ? item.content.map((contentItem, index) => 
          <div 
          key={index} 
          className={styles.contentItem}
          onClick={()=> {
            handleCategoryClick(item, contentItem)
          }}>
            {contentItem.title}({contentItem.count})
          </div>
          ) 
          : item.content }
        </div>
        </React.Fragment>
        )}
      </div>
    </div>
  )
};