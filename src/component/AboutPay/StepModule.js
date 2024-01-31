import styles from './Step.module.css'
import React from 'react';
export function StepModule({activeTab}){
    //스탭 메뉴
    const stepItems = [
        { id: 1, title: '장바구니' },
        { id: 2, title: '주문서 작성' },
        { id: 3, title: '결제하기' },
        { id: 4, title: '주문 완료' },
    ];
return(
    <div className={styles.stepBlock}>
        <div className={styles.stepBar}>
        {stepItems.map((item, index)=> (
            <React.Fragment key={index}>
            {item.id === activeTab ?
            <div key={index} className={styles.stepOn}> 
                <p>Step 0{item.id}</p>
                <h5>{item.title}</h5>
            </div>
            : <div className={styles.step}>
                <p>Step 0{item.id}</p>
                <h5>{item.title}</h5>
            </div>
            }
            {item.id < 4 && 
            <div className={styles.iconlocation}>
                <i className="fal fa-chevron-right"></i>
            </div>
            }
            </React.Fragment>
            ))}
        </div>
    </div>
    )
}