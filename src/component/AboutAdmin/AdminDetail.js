import { Tab } from '../AboutDetail/Tab'
import styles from './AdminDetail.module.css'
import { TopBanner } from '../AboutHeader/TopBanner'
import { AdminHeader } from './AdminHeader'
import { AdminMenuData } from './AdminMenuData'

export function AdminDetail(props) {
  return(
    <div>
      <AdminHeader/>
      <div className={styles.sectionSeperate}>
        <AdminMenuData/>
        <main className={styles.main}>
          <section className={styles.head}>
            <div className={styles.headTop}>


              {/* 상품 이미지 부분 */}
              <div className={styles.headLeft}>
                <input type="file" className={styles.thumnail}/>
              </div>



              {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
              <div className={styles.headRight}>
                <div className={styles.textBox}>
                  <input type='text' placeholder='상품명을 입력해주세요'/>
                </div>
                <h4 className={styles.h4}>
                  <div className={styles.priceTag}>
                    <div>
                      <h3><input type='text' placeholder='할인율을 입력해주세요'/> %</h3>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                      <input type='text' placeholder='상품 가격을 입력해주세요'/>원
                    </div>
                  </div>
                </h4>




                <div className={styles.textBox}>
                  {/* 상품 수량 및 옵션, 최종 결제금액 */}
                  <label>
                    <input type='number' placeholder='상품의 보유 수량을 입력해주세요'/> 개
                  </label>
                  <br/>
                  <div style={{display: 'flex', alignItems:'center', gap:'0.5em'}}>
                      <input type='text'placeholder='상품의 옵션을 입력해주세요'/>
                    <button> 
                    +
                    </button>
                  </div>
                </div>

                {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
                <div className={styles.textButton}>
                  <button 
                  className={styles.mainButton}
                  >등록하기</button>
                  <div className={styles.sideTextButton}>
                    <button 
                    className={styles.sideButton}>삭제하기</button>
                    <button 
                    className={styles.sideButton}>
                    &nbsp;임시저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 탭 부분 */}
          <div className={styles.sticky} >
            <Tab navigate={props.navigate}/>
          </div>     
        </main>
        <div className={styles.leftSideBar}>
          사이드바 내용
        </div>
      </div>
    </div>
  )
}