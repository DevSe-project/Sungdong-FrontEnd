import { useState } from 'react';
import styles from './AdminDetail.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { AdminTabInfo } from '../TabInfo/AdminTabInfo';
import { useProduct, useProductActions } from '../../../Store/DataStore';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

export function AdminDetail() {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ big: null, medium: null, small: null });
  const product = useProduct();
  const {setProduct, resetProduct, setProductOption, setProductCategory} = useProductActions();
  const [addInputOption, setAddInputOption] = useState(0);
  const [middleCategory, setMiddleCategory] = useState([]);
  const [lowCategory, setLowCategory] = useState([]);
  const { isLoading, isError, error, data:categoryData } = useQuery({queryKey:['category']});

  const handleCategoryClick = (categoryType, category) => {
    setSelectedCategory(prevState => ({
      ...prevState,
      [categoryType]: category,
    }));
  };


  function FilteredHighCategoryData() {
    return categoryData.filter(element => /^[A-Z]$/.test(element.id));
  }

  function FilteredMiddleCategoryData(itemId) {
    const newData = categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.id));
    setMiddleCategory(newData);
  }

  function FilteredLowCategoryData(itemId) {
    const newData = categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.id));
    setLowCategory(newData);
  }


  const handleInputChange = (event) => {
    // 입력 값에서 쉼표를 제외하고 저장
    const formattedValue = event.target.value.replace(/,/g, '');
    
    // 숫자가 아닌 문자를 제외하고 저장
    const numericValue = formattedValue.replace(/\D/g, '');

    setProduct("price", numericValue);
  }

  function AddDiscountFunc(discount){
    const numericValue = discount.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 100) {
      setProduct("discount", numericValue);
    }
    else{
      alert("할인율은 최소 0부터 100%까지 설정 가능합니다.");
      return;
    }
  }

  function AddInputOptionFunc(optionCnt){
    const numericValue = optionCnt.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 10) {
      setAddInputOption(numericValue);
    } 
    else {
      alert("옵션 수량 최소 0개부터, 최대 10개까지만 가능하도록 설정되어 있습니다.");
      return;
    }
  }

  function AddSupplyFunc(supplyCnt){
    const numericValue = supplyCnt.replace(/\D/g, '');
    if(numericValue > -1 && numericValue <= 999) {
      setProduct("supply", numericValue);
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

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return(
    <div>
      <AdminHeader/>
      <div className={styles.main}>
        <AdminMenuData/>
        <main className={styles.container}>
          <div className={styles.bodyHeader}>
            <h1>상품 등록</h1>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '1em', marginTop: '1em', alignItems: 'center'}}>
              <div className={styles.categoryContainer}>
                  <div style={{overflowY: 'auto'}}>
                    {categoryData
                    && FilteredHighCategoryData().map((item, index)=> (
                    <div onClick={()=> {
                      setLowCategory([]);
                      handleCategoryClick('big', item.id);
                      FilteredMiddleCategoryData(item.id);
                      setProductCategory('highId', item.id);
                      setProductCategory('middleId', '');
                      setProductCategory('lowId', '');
                    }} 
                    style={{backgroundColor: selectedCategory.big === item.id && 'lightgray'}}
                    key={index} 
                    className={styles.categoryInner}
                    >
                      {item.name}
                      <i className="far fa-chevron-right" style={{color: 'gray'}}/>
                    </div>
                    ))}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div style={{overflowY: 'auto'}}>
                    {middleCategory != null && middleCategory.map((item, index) => (
                      <div onClick={()=> {
                        FilteredLowCategoryData(item.id)
                        handleCategoryClick('medium', item.id);
                        setProductCategory('middleId', item.id);
                        setProductCategory('lowId', '');
                        }} 
                        key={index} 
                        style={{backgroundColor: selectedCategory.medium === item.id && 'lightgray'}}
                        className={styles.categoryInner}
                        >
                        {item.name}
                      <i className="far fa-chevron-right" style={{color: 'gray'}}/>
                    </div>
                    ))}
                  </div>
                </div>
                <div className={styles.categoryContainer}>
                  <div style={{overflowY: 'auto'}}>
                    {lowCategory != null && lowCategory.map((item, index) => (
                      <div 
                        key={index} 
                        style={{backgroundColor: selectedCategory.small === item.id && 'lightgray'}}
                        onClick={()=> {
                          handleCategoryClick('small', item.id);
                          setProductCategory('lowId', item.id);
                        }}
                        className={styles.categoryInner}
                        >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <h4 style={{fontSize: '1.1em', color: 'red', fontWeight: '750'}}>
                선택된 카테고리 : {product.category.highId} - {product.category.middleId} - {product.category.lowId}
              </h4>
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
                  <input style={{width: '20em'}}className={styles.input} onChange={(e)=>setProduct("title", e.target.value)} type='text' placeholder='상품명을 입력해주세요'/>
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
                    <h4 style={{color: 'red', fontWeight: '750'}}>
                    적용가 : 
                    {product.discount !== null && product.discount !== undefined
                      ? isNaN(product.price - (product.price * (product.discount / 100)))
                        ? '할인율이 잘못 설정되었습니다.'
                        : `${((product.price - (product.price * (product.discount / 100))).toLocaleString())}원`
                      : `${product.price.toLocaleString()}원`}
                    </h4>
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