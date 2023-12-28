// Product.js

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './Product.module.css';

export function Product() {
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useQuery({ queryKey: ['data'] });

  if (isLoading) {
    return <p>Loading..</p>;
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
              navigate(`/detail/${item.id}`);
            }}
            key={index}
            className={styles.gridItem}
          >
            <div className={styles.thumnail_container}>
              <img className={styles.thumnail} src={item.image.original} alt="상품 이미지" />
            </div>
            <div className={styles.product_title}>
              {item.supply <= 0 ? (
                <div style={{ display: 'flex' }}>
                  <p className={styles.discountText}>{item.title}</p>
                  &nbsp;
                  <p style={{ color: 'red', fontWeight: '750' }}>품절</p>
                </div>
              ) : (
                <p style={{ fontSize: '1.05em', fontWeight: 'bold', margin: '0px' }}>{item.title}</p>
              )}
              <div className={styles.product_price}>
                {item.discount ? (
                  <div className={styles.discountSection}>
                    <p className={styles.discountText}>
                      \{item.price.toLocaleString()}
                    </p>
                    <p className={styles.discountText}>
                      {item.discount ? (
                        <>
                          <span className={styles.discountPercentage}>({item.discount}%)</span>
                          &nbsp; <i className="fal fa-long-arrow-right" />
                        </>
                      ) : (
                        `${item.title}`
                      )}
                    </p>
                    <h3 className={styles.discountedPrice}>
                      \{(item.price - (item.price / 100) * item.discount).toLocaleString()}
                    </h3>
                  </div>
                ) : (
                  <h3>\{item.price.toLocaleString()}</h3>
                )}
                <span>{item.category && `${item.category.main}`}</span>
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