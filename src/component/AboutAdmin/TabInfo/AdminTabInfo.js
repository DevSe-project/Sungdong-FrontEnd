import styles from './AdminTabInfo.module.css'
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export function AdminTabInfo(){
  const [editorData, setEditorData] = useState('');
  // 상품정보 데이터
  const productInfo = [
    {label: '상품코드', value: <input className={styles.input} type='text'/>},
    {label: '브랜드', value: <input className={styles.input} type='text'/>},
    {label: '원산지', value: <input className={styles.input} type='text'/>},
    {label: '상품상태',value: <input className={styles.input} type='text'/>},
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
          {/* 에디터 훅 사용 */}
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