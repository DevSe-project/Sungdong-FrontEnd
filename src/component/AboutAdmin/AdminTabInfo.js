import styles from './AdminTabInfo.module.css'
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export function AdminTabInfo(){
  const [editorData, setEditorData] = useState('');
  // 상품정보 데이터
  const productInfo = [
    {label: '상품번호', value: <input type='text'/>},
    {label: '브랜드', value: <input type='text'/>},
    {label: '원산지', value: <input type='text'/>},
    {label: '상품상태',value: <input type='text'/>},
  ]

  const returnInfo = [
    {label: '택배사', value: 'CJ대한통운'},
    {label: '반품 배송비', value: '편도 5,000원(최초 배송비 무료인 경우 10,000원 부과)'},
    {label: '보내실 곳', value: '울산광역시 남구 산업로440번길 8 (주)성동물산  (우 : 44781)'},
    {label: '반품/교환 요청 가능 기간', value: '구매자 단순 변심은 상품 구매 후 7일 이내(구매자 반품 배송비 부담)'},
    {label: '반품/교환 불가능 사유', value: '1. 반품요청기간이 지난 경우'},
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
        <p>
          <CKEditor
          editor={ ClassicEditor }
          data={editorData}
          onReady={ ( editor ) => {
            console.log( "CKEditor5 React Component is ready to use!", editor );
          } }
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            setEditorData(data);
            console.log( { event, editor, data } );
          } }
          />
        </p>
      </div>
    </div>

        {/* 반품 / 교환 정보 */}
    <div id='2' className="tab-content">
      <div className={styles.reviewHeader}>
        <h3 style={{borderBottom: '3px solid #cc0000', marginBottom: '1em'}}>반품 / 교환정보</h3>
        <p>반품 시 반품사유, 택배사, 배송비, 반품지 주소를 협의 후 반품상품 발송 바랍니다.</p>
      </div>
      <div className={styles.form}>
        {returnInfo.map((item, key) => 
        <div key={key} className={styles.formInner}>
          <div className={styles.label}>
            <p>{item.label}</p>
          </div>
          <div className={styles.content}>
            <p>{item.value}</p>
          </div>
        </div>
        )}
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
  )
        }