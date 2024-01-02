import { useState } from 'react';
import styles from './AdminDetail.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { AdminTabInfo } from '../TabInfo/AdminTabInfo';
import { useProduct, useProductActions } from '../../../Store/DataStore';
import axios from 'axios';

export function AdminDetail() {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const product = useProduct();
  const {setProduct, resetProduct, setProductOption} = useProductActions();
  const [addInputOption, setAddInputOption] = useState(0);
  
  //카테고리 데이터 fetch
  const fetchCategoryData = async() => {
    try{
      const response = await axios.get("/category", 
        {
          headers : {
            "Content-Type" : "application/json"
          }
        }
      )
      return response.data;
    } catch(error) {
      throw new Error('카테고리를 불러오던 중 오류가 발생했습니다.');
    }
  }
  // 카테고리 데이터 불러오기
  //const { isLoading, isError, error, data:categoryData } = useQuery({queryKey:['category'], queryFn: ()=> fetchCategoryData();});


  const handleInputChange = (event) => {
    // 입력 값에서 쉼표를 제외하고 저장
    const formattedValue = event.target.value.replace(/,/g, '');
    
    // 숫자가 아닌 문자를 제외하고 저장
    const numericValue = formattedValue.replace(/\D/g, '');

    // 숫자를 천 단위로 구분자를 추가하여 저장
    const numberWithCommas = new Intl.NumberFormat('ko-KR').format(numericValue);

    setProduct("price", numberWithCommas);
  }

  function AddDiscountFunc(discount){
    const numericValue = discount.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 100) {
      setProduct("discount", discount);
    }
    else{
      alert("할인율은 최소 0부터 100%까지 설정 가능합니다.");
      return;
    }
  }

  function AddInputOptionFunc(optionCnt){
    const numericValue = optionCnt.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 10) {
      setAddInputOption(optionCnt);
    } 
    else {
      alert("옵션 수량 최소 0개부터, 최대 10개까지만 가능하도록 설정되어 있습니다.");
      return;
    }
  }

  function AddSupplyFunc(supplyCnt){
    const numericValue = supplyCnt.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 999) {
      setProduct("supply", supplyCnt);
    }
    else {
      alert("최소 1개부터 999개까지 재고 설정이 가능합니다.");
      return;
    }
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
          value={product.option[`option${i}`]}
          onChange={(e)=>setProductOption(`option${i}`, e.target.value)}
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
              대 카테고리
              <i className="far fa-chevron-right" style={{color: 'gray'}}/>
            </div>
          </div>
          <i className="fas fa-chevron-right"/>
          <div className={styles.categoryContainer}>
            <div className={styles.categoryInner}>
              중 카테고리
            </div>
          </div>
          <i className="fas fa-chevron-right"/>
          <div className={styles.categoryContainer}>
            <div className={styles.categoryInner}>
              소 카테고리
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
                      <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5em'}}>
                        <label style={{display: 'flex'}}>
                          <input 
                          className={styles.input} 
                          type='text' 
                          placeholder='할인율을 입력해주세요'
                          value={product.discount}
                          onChange={(e)=>AddDiscountFunc(e.target.value)} 
                          />
                          <span className={styles.spanStyle}>%</span>
                        </label>
                      </div>
                      }
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
                      <label style={{display:'flex'}}>
                      <input
                        className={styles.input}
                        type='text'  // type을 'text'로 변경하여 숫자와 쉼표만 표시되도록 함
                        placeholder='판매가를 입력해주세요'
                        value={product.price}
                        onChange={handleInputChange}
                      />                       
                      <span className={styles.spanStyle}>원</span>
                      </label>
                    </div>
                  </div>
                </h4>




                <div className={styles.textBox}>
                  {/* 상품 수량 및 옵션, 최종 결제금액 */}
                  <label style={{display:'flex'}}>
                      <input 
                      className={styles.input} 
                      type='text' 
                      placeholder='재고수량을 입력해주세요'
                      value={product.supply}
                      onChange={
                        (e)=> {
                          AddSupplyFunc(e.target.value);
                        }
                      }
                      />
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
                      <input 
                      className={styles.input} 
                      type='text' 
                      value={addInputOption} 
                      onChange={(e)=> AddInputOptionFunc(e.target.value)}
                      placeholder='상품의 옵션 개수를 입력하세요'
                      />
                      <button className={styles.spanStyle}>개</button>
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