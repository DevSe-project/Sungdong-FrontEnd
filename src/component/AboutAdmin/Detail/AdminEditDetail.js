import { useEffect, useState } from 'react';
import styles from './AdminDetail.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { AdminTabInfo } from '../TabInfo/AdminTabInfo';
import { useProduct, useProductActions } from '../../../store/DataStore';
import axios from '../../../axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export function AdminEditDetail() {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isOption, setIsOption] = useState(false);
  const product = useProduct();
  const { setProduct, resetProduct, setProductOption, editProduct, editOptionProduct, resetProductOption } = useProductActions();
  const [addInputOption, setAddInputOption] = useState(0);

  useEffect(() => {
    return () => {
      resetProduct();
      window.location.reload();
      // 컴포넌트가 언마운트될 때 Product 상태 리셋 및 새로고침
    };
  }, [resetProduct]);

  //데이터 불러오기
  const { isLoading, isError, error, data } = useQuery({ queryKey: ['data'] });

  //데이터 불러오기 이전 loadData()함수 실행 금지
  useEffect(() => {
    const fetchData = async () => {
      if (data !== null) {
        await editProduct(loadData());
        await editOptionProduct(loadData());
      }
    };

    fetchData();

  }, [isLoading]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const response = await axios.post('/product/upload', formData, {
          withCredentials: false,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // 성공 시 추가된 상품 정보를 반환합니다.
        setImageUrl(response.data.imageUrl);
        setProduct("product_image_original", response.data.imageUrl)
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        console.error('이미지 업로드 에러:', error);
      }
    } else {
      console.error('이미지를 선택하세요.');
    }
  };

  //주소창 입력된 id값 받아오기
  let { id } = useParams();

  const loadData = () => {
    if (data != null) {
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const detaildata = data.find((item) => item.product_id === id);
      return detaildata;
    } else {
      return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
    }
  }


  const handleInputChange = (event) => {
    // 입력 값에서 쉼표를 제외하고 저장
    const formattedValue = event.target.value.replace(/,/g, '');

    // 숫자가 아닌 문자를 제외하고 저장
    const numericValue = formattedValue.replace(/\D/g, '');

    setProduct("product_price", numericValue);
  }

  function AddDiscountFunc(discount) {
    const numericValue = discount.replace(/\D/g, '');
    if (numericValue > -1 && numericValue <= 100) {
      setProduct("product_discount", numericValue);
    }
    else {
      alert("할인율은 최소 0부터 100%까지 설정 가능합니다.");
      return;
    }
  }

  function AddInputOptionFunc(optionCnt) {
    const numericValue = optionCnt.replace(/\D/g, '');
    if (numericValue > -1 && numericValue <= 10) {
      setAddInputOption(numericValue);
    }
    else {
      alert("옵션 수량 최소 0개부터, 최대 10개까지만 가능하도록 설정되어 있습니다.");
      return;
    }
  }

  function AddSupplyFunc(supplyCnt) {
    const numericValue = supplyCnt.replace(/\D/g, '');
    if (numericValue > -1 && numericValue <= 999) {
      setProduct("product_supply", numericValue);
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
          onChange={(e) => setProductOption(`option${i}`, e.target.value)}
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

  return (
    <div className={styles.main}>
      <main className={styles.container}>
        <div className={styles.bodyHeader}>
          <h1>상품 수정</h1>
        </div>
        <section className={styles.head}>
          <div className={styles.headTop}>


            {/* 상품 이미지 부분 */}
            <div className={styles.headLeft}>
              <img id="productImage" src={imageUrl || product.product_image_original} alt="상품 이미지" className={styles.thumnail} />
              <div>
                <input type="file" id="imageInput" accept="image/*" onChange={handleFileChange} />
                <button onClick={uploadImage}>이미지 업로드</button>
              </div>
            </div>



            {/* 상품 정보(상품 이름, 가격) 부분 (삼항연산자 : 스켈레톤 처리) */}
            <div className={styles.headRight}>
              <div className={styles.textBox}>
                <input style={{ width: '20em' }} className={styles.input} value={product.product_title} onChange={(e) => setProduct("product_title", e.target.value)} type='text' placeholder='상품명을 입력해주세요' />
              </div>
              <h4 className={styles.h4}>
                <div className={styles.priceTag}>
                  <div style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
                    <div>
                      <span className={isDiscount ? styles.selectedButton : styles.selectButton} onClick={() => setIsDiscount(true)}>
                        할인 설정
                      </span>
                      <span className={isDiscount ? styles.selectButton : styles.selectedButton} onClick={() => {
                        setIsDiscount(false)
                        setProduct("product_discount", 0);
                      }}>
                        설정 안함
                      </span>
                    </div>
                    {isDiscount &&
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5em' }}>
                        <label style={{ display: 'flex' }}>
                          <input
                            className={styles.input}
                            type='text'
                            placeholder='할인율을 입력해주세요'
                            value={product.product_discount}
                            onChange={(e) => AddDiscountFunc(e.target.value)}
                          />
                          <span className={styles.spanStyle}>%</span>
                        </label>
                      </div>
                    }
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <label style={{ display: 'flex' }}>
                      <input
                        className={styles.input}
                        type='text'  // type을 'text'로 변경하여 숫자와 쉼표만 표시되도록 함
                        placeholder='판매가를 입력해주세요'
                        value={product.product_price}
                        onChange={handleInputChange}
                      />
                      <span className={styles.spanStyle}>원</span>
                    </label>
                  </div>
                  <h4 style={{ fontSize: '1.1em', fontWeight: '750' }}>
                    적용가 :
                    <span style={{ color: '#CC0000', fontWeight: '750', margin: '0.5em' }}>
                      {product.product_discount !== null && product.product_discount !== undefined
                        ? isNaN(product.product_price - (product.product_price * (product.product_discount / 100)))
                          ? '할인율이 잘못 설정되었습니다.'
                          : `${(product.product_price - (product.product_price / 100) * product.product_discount)
                            .toLocaleString('ko-KR')}원`
                        : `${product.product_price.toLocaleString('ko-KR')}원`}
                    </span>
                  </h4>
                </div>
              </h4>




              <div className={styles.textBox}>
                {/* 상품 수량 및 옵션, 최종 결제금액 */}
                <label style={{ display: 'flex' }}>
                  <input
                    className={styles.input}
                    type='text'
                    placeholder='재고수량을 입력해주세요'
                    value={product.product_supply}
                    onChange={
                      (e) => {
                        AddSupplyFunc(e.target.value);
                      }
                    }
                  />
                  <span className={styles.spanStyle}>개</span>
                </label>
                <br />
                <div>
                  <span className={isOption ? styles.selectedButton : styles.selectButton} onClick={() => setIsOption(true)}>
                    옵션 설정
                  </span>
                  <span className={isOption ? styles.selectButton : styles.selectedButton} onClick={() => {
                    setIsOption(false);
                    setAddInputOption(0);
                    resetProductOption();
                  }}>
                    설정 안함
                  </span>
                </div>
                <br />
                {isOption &&
                  <>
                    <label style={{ display: 'flex' }}>
                      <input
                        className={styles.input}
                        type='text'
                        value={addInputOption}
                        onChange={(e) => AddInputOptionFunc(e.target.value)}
                        placeholder='상품의 옵션 개수를 입력하세요'
                      />
                      <button className={styles.spanStyle}>개</button>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {renderInputs()}
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </section>


        {/* 탭 부분 */}
        <AdminTabInfo />
      </main>
    </div>
  )
}