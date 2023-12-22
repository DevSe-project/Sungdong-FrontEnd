import { useState } from 'react';
import styles from './AdminDetail.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { AdminTabInfo } from '../TabInfo/AdminTabInfo';

export function AdminDetail(props) {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [addInputOption, setAddInputOption] = useState(0);


  function AddInputOptionFunc(){
    if(addInputOption > 3) return;
    setAddInputOption(addInputOption+1);
  }

  // <input> 요소를 렌더링하는 함수
  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < addInputOption; i++) {
      inputs.push(
        <input
          key={i}
          className={styles.input}
          type='text'
          placeholder='상품의 옵션을 입력해주세요'
        />
      );
    }
    return inputs;
  };

  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <main className={styles.container}>
          <div className={styles.bodyHeader}>
            <h1>상품 등록</h1>
          </div>
        <div style={{display: 'flex', gap: '1em', marginTop: '1em', alignItems: 'center'}}>
          <div className={styles.categoryContainer}>
            <div className={styles.categoryInner}>
              메인 카테고리
              <i className="far fa-chevron-right" style={{color: 'gray'}}/>
            </div>
          </div>
          <i className="fas fa-chevron-right"/>
          <div className={styles.categoryContainer}>
            <div className={styles.categoryInner}>
              서브 카테고리
            </div>
          </div>
        </div>
          <section className={styles.head}>
            <div className={styles.headTop}>


              {/* 상품 이미지 부분 */}
              <div className={styles.headLeft}>
                <input type="file" className={styles.thumnail}/>
              </div>



              {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
              <div className={styles.headRight}>
                <div className={styles.textBox}>
                  <input style={{width: '20em'}}className={styles.input} type='text' placeholder='상품명을 입력해주세요'/>
                </div>
                <h4 className={styles.h4}>
                  <div className={styles.priceTag}>
                    <div style={{display: 'flex', gap: '1em', flexDirection: 'column'}}>
                      <div>
                        <span className={isDiscount ? styles.selectedButton : styles.selectButton} onClick={()=>setIsDiscount(true)}>
                          할인 설정
                        </span>
                        <span className={isDiscount ? styles.selectButton : styles.selectedButton} onClick={()=>setIsDiscount(false)}>
                          설정 안함
                        </span>
                      </div>
                      {isDiscount &&
                      <label style={{display:'flex'}}>
                        <input className={styles.input} type='text' placeholder='할인율을 입력해주세요'/>
                        <span className={styles.spanStyle}>%</span>
                      </label>
                      }
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                      <label style={{display:'flex'}}>
                        <input className={styles.input} type='text' placeholder='판매가를 입력해주세요'/>
                        <span className={styles.spanStyle}>원</span>
                      </label>
                    </div>
                  </div>
                </h4>




                <div className={styles.textBox}>
                  {/* 상품 수량 및 옵션, 최종 결제금액 */}
                  <label style={{display:'flex'}}>
                      <input className={styles.input} type='number' placeholder='재고수량을 입력해주세요'
                      min={1}
                      max={1000}/>
                      <span className={styles.spanStyle}>개</span>
                  </label>
                  <br/>
                  <div>
                    <span className={isOption ? styles.selectedButton : styles.selectButton} onClick={()=>setIsOption(true)}>
                      옵션 설정
                    </span>
                    <span className={isOption ? styles.selectButton : styles.selectedButton} onClick={()=>setIsOption(false)}>
                      설정 안함
                    </span>
                  </div>
                  <br/>
                  {isOption &&
                  <>
                    <label style={{display: 'flex'}}>
                      <input className={styles.input} type='text'placeholder='상품의 옵션을 입력해주세요'/>
                      <button className={styles.spanStyle} onClick={()=>AddInputOptionFunc()}>+</button>
                    </label>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      {renderInputs()}
                    </div>
                  </>
                  }
                </div>
              </div>
            </div>
          </section>


          {/* 탭 부분 */}
          <AdminTabInfo/>
        </main>
      </div>
    </div>
  )
}