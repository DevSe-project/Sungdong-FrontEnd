// Product.js

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Product.module.css';

export function Product() {
  const navigate = useNavigate();
  const { isLoading, isError, error, data: data } = useQuery({ queryKey: ['data'] });


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
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className={styles.mainContainer}>
      <div style={{ display: 'flex', marginTop: '1em', marginLeft: '1em', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2em' }}><i style={{ color: '#CC0000' }} className="fab fa-product-hunt" /> 신상품</h1>
      </div>
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
                  <p style={{ fontSize: '0.9em', fontWeight: '950', margin: '0px' }}>{item.product_title}</p>
                }
                <p style={{ fontSize: '0.9em', fontWeight: '550', margin: '1px', marginLeft: 0, color: 'orangered' }}>{item.product_brand}</p>
                <div className={styles.product_price}>
                  {item.product_discount
                    ? (
                      <div className={styles.discountSection}>
                        <div className={styles.discountSort}>
                          {/* 할인률 */}
                          <span className={styles.discountPercentage}>
                            {item.product_discount}%
                          </span>
                          {/* 할인 전 표준가 */}
                          <p className={styles.discountText}>
                            {parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3em', alignItems: 'center' }}>
                          {/* 공급가 */}
                          <h3 className={styles.price}>
                            {parseInt(item.product_amount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      // 표준 기본가
                      <h3 className={styles.price}>{parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</h3>
                    )}
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
    </div>
  );
}