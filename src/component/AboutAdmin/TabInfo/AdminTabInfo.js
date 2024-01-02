import styles from './AdminTabInfo.module.css'
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useProduct, useProductActions } from '../../../Store/DataStore';
import axios from 'axios';
import { GetCookie } from '../../../customFn/GetCookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function AdminTabInfo(){
  const product = useProduct();
  const {setProduct, resetProduct} = useProductActions();

  const queryClient = useQueryClient();
  //등록 fetch 함수
  const fetchAddData = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.post("/product", 
        JSON.stringify(
          product
        ),
        {
          headers : {
            "Content-Type" : "application/json",
            'Authorization': `Bearer ${token}`
          }
        }
      )
      // 성공 시 추가된 상품 정보를 반환합니다.
      return response.data;
    } catch (error) {
      // 실패 시 예외를 throw합니다.
      throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
    }
  };

  //상품 등록 함수
  const { addProductMutate } = useMutation({mutationFn: fetchAddData,
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('상품이 추가되었습니다.', data);
      // 상태를 다시 불러와 갱신합니다.
      queryClient.invalidateQueries(['data']);
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('상품을 추가하는 중 오류가 발생했습니다.', error);
    },
  })
  // 상품정보 데이터
  const productInfo = [
    {label: '상품코드', value: <input className={styles.input} value={product.productId} onChange={(e)=>setProduct("productId", e.target.value)} type='text' placeholder='A001-10001'/>},
    {label: '브랜드', value: <input className={styles.input} value={product.brand} onChange={(e)=>setProduct("brand", e.target.value)} type='text' placeholder='한국브랜드'/>},
    {label: '원산지', value: <input className={styles.input} value={product.madeIn} onChange={(e)=>setProduct("madeIn", e.target.value)} type='text' placeholder='국산'/>},
    {label: '상품상태',value: <input className={styles.input} value={product.state} onChange={(e)=>setProduct("state", e.target.value)} type='text' placeholder='새 상품 / 중고'/>},
  ]

  return(
    <div className={styles.tabInnerHeader}>

    {/* 탭 상품 정보 */}
    <h5 style={{fontWeight: '650'}}>상품 정보</h5>
    <div className={styles.productDetail}>
    {productInfo.map((item) => 
      <div className={styles.productDetailInner}>
        <div className={styles.productDetail_label}>
          <p>{item.label}</p>
        </div>
        <div className={styles.productDetail_content}>
          {item.value}
        </div>
      </div>
    )}
    </div>


    {/* 탭 상품 설명 */}
    <div id='1' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>상품 설명</h3>
        {/* 에디터 훅 사용 */}
        <CKEditor
        editor={ ClassicEditor }
        data={product.content}
        onReady={ ( editor ) => {
          console.log( "CKEditor5 React Component is ready to use!", editor );
        } }
        onChange={ ( event, editor ) => {
          const data = editor.getData();
          setProduct('content', data);
          console.log( { event, editor, data } );
        } }
        />
      </div>
    </div>


    {/* 버튼 부분들 (등록하기, 초기화, 임시저장) */}
    <div className={styles.textButton}>
      <button 
      className={styles.mainButton}
      // onClick={()=>addProductMutate.mutate();}
      >등록하기
      </button>
      <div className={styles.sideTextButton}>
        <button 
        className={styles.sideButton}
        onClick={()=>resetProduct()}
        >
          초기화
        </button>
        <button 
        className={styles.sideButton}>
        &nbsp;임시저장
        </button>
      </div>
    </div>
  </div>
  )
        }