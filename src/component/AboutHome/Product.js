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
            <div className={styles.frame}>
              <img className={styles.thumnail} src={item.image.original} alt="상품 이미지" />
            </div>
            <div className={styles.product}>
              {item.supply <= 0 ? (
                <div style={{ display: 'flex' }}>
                  <p className={styles.discountText}>{item.title}</p>
                  &nbsp;
                  <p style={{ color: 'red', fontWeight: '750' }}>품절</p>
                </div>
              ) : (
                <p style={{ fontSize: '1.05em', fontWeight: 'bold', margin: '0px' }}>{item.title}</p>
              )}
              <div className={styles.price}>
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






// import { QueryClient, useQuery } from '@tanstack/react-query';
// import { useData } from '../../Store/DataStore';
// import styles from './Product.module.css'; 
// import { useNavigate } from 'react-router-dom';
// export function Product(){
//   const navigate = useNavigate();
//   const { isLoading, isError, error, data } = useQuery({queryKey:['data']});
//   if(isLoading){
//     return <p>Loading..</p>;
//   }
//   if(isError){
//     return <p>에러 : {error.message}</p>;
//   }
//   return(
//   <div className={styles.main}>
//     <div className={styles.container}>
//       <div className={styles.row}>
//         {data !== null ? data.map((item,index)=>(
//           <div onClick={()=>{navigate(`/detail/${item.id}`)}} key={index} className={styles.col}>            
//             <div className={styles.frame}>
//               <img className={styles.thumnail} src={item.image.original} alt="상품 이미지"/>
//             </div>
//             <div className={styles.product}>
//               {item.supply <= 0 
//               ? 
//               <div style={{display: 'flex'}}>
//                 <p style={{color: 'gray', textDecoration: "line-through"}}>
//                   {item.title}
//                 </p>
//                 &nbsp;
//                 <p style={{color: '#CC0000', fontWeight: '650'}}>
//                   품절
//                 </p>
//               </div>
//               : <p style={{fontSize: '1.05em', fontWeight: 'bold', margin: '0px'}}>{item.title}</p>}
//               <div className={styles.price}>
//               {item.discount
//                 ? <div style={{display: 'flex', alignItems: 'center', gap: '0.5em', justifyContent: 'flex-end'}}>
//                   <p style={{textDecoration: "line-through", color: "gray", margin: '0'}}>
//                     \{item.price.toLocaleString()}
//                   </p>
//                   <p>{item.discount 
//                     ? <>
//                       <span style={{color: 'red', fontWeight: '750'}}>
//                         ({item.discount}%)
//                       </span>
//                       &nbsp; <i className="fal fa-long-arrow-right"/>
//                       </>
//                     : `${item.title}`}
//                   </p>
//                   <h3>
//                     \{(item.price-((item.price/100)*item.discount)).toLocaleString()}
//                   </h3>
//                 </div>
//                 : <h3>\{item.price.toLocaleString()}</h3>
//                 }
//                 <br/><hr/><br/>
//                 <span>{item.category && `${item.category.main}`}</span>
//               </div>
//             </div>
//           </div>
//         ))
//         : <>
//           {/* 스켈레톤 레이아웃 */}
//           <div className={styles.colskeleton}>
//             <div className={styles.frameskeleton}>
//             &nbsp;
//             </div>
//             <div className={styles.nameskeleton}>
//               &nbsp;
//             </div>
//             <div className={styles.priceskeleton}>
//               &nbsp;
//             </div>
//           </div>
//           <div className={styles.colskeleton}>
//             <div className={styles.frameskeleton}>
//             &nbsp;
//             </div>
//             <div className={styles.nameskeleton}>
//               &nbsp;
//             </div>
//             <div className={styles.priceskeleton}>
//               &nbsp;
//             </div>
//           </div>
//           <div className={styles.colskeleton}>
//             <div className={styles.frameskeleton}>
//             &nbsp;
//             </div>
//             <div className={styles.nameskeleton}>
//               &nbsp;
//             </div>
//             <div className={styles.priceskeleton}>
//               &nbsp;
//             </div>
//           </div>
//           <div className={styles.colskeleton}>
//             <div className={styles.frameskeleton}>
//             &nbsp;
//             </div>
//             <div className={styles.nameskeleton}>
//               &nbsp;
//             </div>
//             <div className={styles.priceskeleton}>
//               &nbsp;
//             </div>
//           </div>
//           <div className={styles.colskeleton}>
//             <div className={styles.frameskeleton}>
//             &nbsp;
//             </div>
//             <div className={styles.nameskeleton}>
//               &nbsp;
//             </div>
//             <div className={styles.priceskeleton}>
//               &nbsp;
//             </div>
//           </div>
//         </>
//         }
//       </div>
//     </div>
//   </div>
//   )
// }