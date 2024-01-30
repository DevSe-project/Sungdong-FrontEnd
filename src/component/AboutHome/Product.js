// Product.js

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Product.module.css';

export function Product() {
  const navigate = useNavigate();
  const { isLoading, isError, error, data:data } = useQuery({ queryKey: ['data'] });
  const { data:categoryData } = useQuery({queryKey:['category']});


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
            <div className={styles.thumnail_container}>
              <img className={styles.thumnail} src={item.product_image_original} alt="상품 이미지" />
            </div>
            <div className={styles.product_title}>
              {item.product_supply <= 0 ? (
                <div style={{ display: 'flex' }}>
                  <p className={styles.discountText}>{item.product_title}</p>
                  &nbsp;
                  <p style={{ color: 'red', fontWeight: '750' }}>품절</p>
                </div>
              ) : (
                <p style={{ fontSize: '0.9em', fontWeight: '950', margin: '0px' }}>{item.product_title}</p>
              )}
              <p style={{ fontSize: '0.9em', fontWeight: '550', margin: '1px', marginLeft: 0, color: 'orangered'}}>{item.product_brand}</p>
              <div className={styles.product_price}>
                {item.product_discount 
                ? (
                  <div className={styles.discountSection}>
                    <div style={{display: 'flex', gap: '0.3em', alignItems: 'center'}}>
                      {/* 공급가 */}
                      <h3 style={{ fontSize: '1.15em', fontWeight: '1050' }}>
                        {(item.product_price - (item.product_price / 100) * item.product_discount).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}             
                      </h3>
                      {/* 할인 전 표준가 */}
                      <p className={styles.discountText}>
                        {parseInt(item.product_price).toLocaleString('ko-KR',{ style: 'currency', currency: 'KRW' })}
                      </p>
                    </div>
                    {/* 할인률 */}
                    <span className={styles.discountPercentage}>{item.product_discount}%</span>
                  </div>
                ) : (
                  // 표준 기본가
                  <h3 style={{ fontSize: '1.15em', fontWeight: '1050' }}>{parseInt(item.product_price).toLocaleString('ko-KR',{ style: 'currency', currency: 'KRW' })}</h3>
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
  );
}