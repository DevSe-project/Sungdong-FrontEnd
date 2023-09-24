import { Tab } from '../AboutDetail/Tab'
import styles from './AdminDetail.module.css'
import { TopBanner } from '../AboutHeader/TopBanner'

export function AdminDetail(props) {
  return(
    <div>
      <TopBanner menuOnClick={props.menuOnClick} menu_dynamicStyle={props.menu_dynamicStyle} data={props.data} setData={props.setData} categoryData={props.categoryData} setCategoryData={props.setCategoryData} login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} text_dynamicStyle={props.text_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} />
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
                <input type='text'/>
              </div>
              <h4 className={styles.h4}>
                <div className={styles.priceTag}>
                  <div>
                    <h3><input type='text'/>%</h3>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                    <input type='text'/>원
                  </div>
                </div>
              </h4>




              <div className={styles.textBox}>
                {/* 상품 수량 및 옵션, 최종 결제금액 */}
                <label>
                수량 : <input type='text'/>개
                </label>
                <br/>
                <div style={{display: 'flex', alignItems:'center', gap:'0.5em'}}>
                  옵션 : <input type='text'/>
                </div>
              </div>
                총 수량 개 |
                <h4 className={styles.finalprice}>
                최종 결제 금액 : 
                </h4>

              {/* 버튼 부분들 (결제하기, 장바구니, 찜하기) */}
              <div className={styles.textButton}>
                <button 
                className={styles.mainButton}
                >결제하기</button>
                <div className={styles.sideTextButton}>
                  <button 
                  className={styles.sideButton}>장바구니</button>
                  <button 
                  className={styles.sideButton}>
                  <i className="fa-solid fa-heart"/>
                  &nbsp;찜하기
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
    </div>
  )
}