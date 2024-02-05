import React, { useState } from 'react';
import styles from './CategoryFilter.module.css';
import { useQuery } from '@tanstack/react-query';

export function CategoryFilter({ searchList, filterData }) {
  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });
  const [editIndex, setEditIndex] = useState([]);

  // handleToggleEdit 함수를 수정하여 editIndex를 배열에서 단일 값으로 업데이트합니다.
  const handleToggleEdit = (index) => {
    if (editIndex.includes(index)) {
      setEditIndex(editIndex.filter((item) => item !== index));
    } else {
      setEditIndex([...editIndex, index]);
    }
  };
  // -------------------카테고리 필터 부분----------------------

  // 중복 처리
  const isIncludeParentsCategories = [...new Set(filterData.map((item) => item.parentsCategory_id))];
  const isIncludeTopLevelCategories = [...new Set(isIncludeParentsCategories.map((item) => categoryData.find((categoryItem) => categoryItem.category_id === item)?.parentsCategory_id))];
  const isIncludeCategories = [...new Set(filterData.map((item) => item.category_id))];
  const isIncludeBrands = [...new Set(filterData.map((item) => item.product_brand))];
  const isIncludeMaden = [...new Set(filterData.map((item) => item.product_madeIn))];

  // 카테고리 필터 구성
  const categoryFilter = [
    {
      label: '카테고리',
      prevContent: isIncludeTopLevelCategories.map((topLevelCategory) => {
        const topLevelCategoryItem = categoryData.find((item) => item.category_id === topLevelCategory);
        const topLevelCategoryName = topLevelCategoryItem?.name;
        const topLevelCategoryCount = filterData.filter((item) => categoryData.find((category) => category.category_id === item.parentsCategory_id)?.parentsCategory_id === topLevelCategoryItem.category_id).length;

        // 부모 카테고리 구성
        const parentCategories = isIncludeParentsCategories
          .map((parentCategory) => categoryData.find((item) => item.category_id === parentCategory))
          .filter((parentCategoryItem) => {
            return parentCategoryItem && parentCategoryItem.parentsCategory_id === topLevelCategoryItem.category_id;
          })
          .map((filteredParentCategoryItem) => {
            const parentCategoryName = filteredParentCategoryItem?.name;
            const parentCategoryCount = filterData.filter((item) => item.parentsCategory_id === filteredParentCategoryItem.category_id).length;

            // 자식 카테고리 구성
            const childCategories = isIncludeCategories
              .map((category) => categoryData.find((item) => item.category_id === category))
              .filter((categoryItem) => {
                return categoryItem && categoryItem.parentsCategory_id === filteredParentCategoryItem.category_id;
              })
              .map((filteredChildCategoryItem) => {
                const childCategoryName = filteredChildCategoryItem?.name;
                const childCategoryCount = filterData.filter((item) => item.category_id === filteredChildCategoryItem.category_id).length;

                return {
                  title: childCategoryName,
                  count: childCategoryCount,
                };
              });

            return {
              title: parentCategoryName,
              count: parentCategoryCount,
              content: childCategories,
              isOpen: false,
            };
          });

        return {
          title: topLevelCategoryName,
          count: topLevelCategoryCount,
          content: parentCategories,
        };
      }),
    },
    {
      label: '브랜드',
      content: isIncludeBrands.map((brand) => ({
        title: brand,
        count: filterData.filter((item) => item.product_brand === brand).length,
      }))
    },
    {
      label: '원산지',
      content: isIncludeMaden.map((madeIn) => ({
        title: madeIn,
        count: filterData.filter((item) => item.product_madeIn === madeIn).length,
      }))
    }
  ];
  // 카테고리 필터 클릭 시 진행 함수
  function handleCategoryClick(item, contentItem) {
    let filtered;

    switch (item.label) {
      case '브랜드':
        filtered = searchList.filter((item) => item.product_brand === contentItem.title);
        break;
      case '원산지':
        filtered = searchList.filter((item) => item.product_madeIn === contentItem.title);
        break;
      case '카테고리':
        filtered = searchList.filter((item) => item.category_id === contentItem.title);
        break;
      default:
        filtered = [];
    }

    //클릭 시 로직
    const addCntList = filtered.map((item, index) => ({
      ...item,
      listId: index,
    }));

  };

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.filterUI}>
        {/* categoryData.categories.map((item, key)) => */}
        {categoryFilter.map((item, key) =>
          <React.Fragment key={key}>
            {/* 필터 별 라벨 */}
            <div className={styles.label}>
              {item.label}
            </div>
            <div className={styles.content}>
              {item.prevContent && Array.isArray(item.prevContent) && item.prevContent.map((topLevelCategory, topLevelIndex) => (
                <ul key={topLevelIndex} className={styles.listPosition}>
                  {/* 최상위 카테고리 항목 */}
                  <li
                    className={styles.contentItem}
                    onClick={() => handleCategoryClick(item, topLevelCategory)}>
                    <span className={styles.topFont}>{topLevelCategory.title}<span className={styles.lowFont} style={{fontWeight: '550'}}>({topLevelCategory.count})</span></span>
                  </li>
                  {topLevelCategory.content && Array.isArray(topLevelCategory.content) && topLevelCategory.content.map((parentCategory, parentIndex) => (
                    <ul className={styles.listLowPosition} key={parentIndex}>
                      {/* 부모 카테고리 항목 */}
                      <li
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        className={styles.contentItem}
                        onClick={() => handleCategoryClick(item, parentCategory)}>
                        <span className={styles.lowFont} style={{fontWeight: '650'}}>{parentCategory.title} ({parentCategory.count})</span>
                        <button
                          className="white_button"
                          style={{ marginLeft: '0.3em', padding: '0.5em', width: '0.5em', height: '1em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          onClick={() => handleToggleEdit(parentCategory.title)}
                        >
                          {editIndex.includes(parentCategory.title) ? <i className="fas fa-caret-up" /> : <i className="fas fa-caret-down" />}
                        </button>
                      </li>
                      {editIndex.includes(parentCategory.title) && parentCategory.content && Array.isArray(parentCategory.content) && parentCategory.content.map((childCategory, childIndex) => (
                        <ul className={styles.listLowestPosition}>
                          <li
                            key={childIndex}
                            className={styles.contentItem}
                            onClick={() => handleCategoryClick(item, childCategory)}>
                            <span className={styles.lowFont}>{childCategory.title} ({childCategory.count})</span>
                          </li>
                        </ul>
                      ))}
                    </ul>
                  ))}
                </ul>
              ))}
              {/* 나머지 카테고리 항목 */}
              {item.content && Array.isArray(item.content)
                ? item.content.map((contentItem, index) =>
                  <div
                    key={index}
                    className={styles.contentItem}
                    onClick={() => {
                      handleCategoryClick(item, contentItem)
                    }}>
                    <span className={styles.lowFont}>{contentItem.title}({contentItem.count})</span>
                  </div>
                )
                : item.content}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
};