// Product.js

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Product.module.css';

export function Product() {
  const navigate = useNavigate();
  const { isLoading, isError, error, data: data } = useQuery({ queryKey: ['data'] });
  const { data: categoryData } = useQuery({ queryKey: ['category'] });


  if (isLoading) {
    return (
      // 스켈레톤 레이아웃
      <>
        {[...Array(6)].map((_, index) => (
          <div key={index} className={styles.gridItemSkeleton}>
            <div className={styles.frameSkeleton}>&nbsp;</div>
            <div className={styles.nameSkeleton}>&nbsp;</div>
            <div className={styles.priceSkeleton}>&nbsp;</div>
          </div>
        ))}
      </>
    )
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {data !== null ? (
        data.map((item, index) => (
          <div
            onClick={() => {
              navigate(`/detail/${item.product_id}`);
            }}
            key={index}
            className={styles.gridItem}
          >
            {/* 상품 이미지부 */}
            <div className={styles.thumnail_container}>
              <img className={styles.thumnail} src={item.product_image_original} alt="상품 이미지" />
            </div>
            {/* 상품 제목부 */}
            <div className={styles.productInfo_container}>
              {item.product_supply <= 0 ?
                <div className={styles.product_title}>
                  {/* 상품 제목 */}
                  <div className={styles.discountText}>
                    {item.product_title}
                  </div>
                  {/* 품절 */}
                  <div style={{ color: 'red', fontWeight: '750' }}>
                    품절
                  </div>
                </div>
                :
                <div className={styles.product_title}>
                  {item.product_title}
                </div>
              }
              {/* 상품 가격부 */}
              <div className={styles.product_price}>
                {item.product_discount
                  ? (
                    <div className={styles.discountSection}>
                      <div className={styles.discountText} style={{textDecoration: 'line-through'}}>
                        {parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                      </div>
                      <div className={styles.discountText}>
                        {item.product_discount ? (
                          <>
                            {/* 할일률 표기 */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <i className="fal fa-long-arrow-right" />
                              <div className={styles.price}>
                                {(item.product_price - (item.product_price / 100) * item.product_discount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                              </div>
                              <span className={styles.discountPercentage}>
                                ({item.product_discount}%)
                              </span>
                            </div>
                          </>
                        ) : (
                          // 적용된 할인이 없다면 그냥 제목만
                          `${item.product_title}`
                        )}
                      </div>
                      {/* 할인가 표시 */}
                      {/* 아이콘 */}

                    </div>
                  ) : (
                    <div className={styles.price}>{parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</div>
                  )}
                <span>{
                  categoryData &&
                  [categoryData.find((category) =>
                    category.category_id === item.parentsCategory_id)?.name,
                  categoryData.find((category) =>
                    category.category_id === item.category_id)?.name].filter(Boolean).join(' - ')
                }
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        // 스켈레톤 레이아웃
        <>
          {[...Array(6)].map((_, index) => (
            <div key={index} className={styles.gridItemSkeleton}>
              <div className={styles.frameSkeleton}>&nbsp;</div>
              <div className={styles.nameSkeleton}>&nbsp;</div>
              <div className={styles.priceSkeleton}>&nbsp;</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}