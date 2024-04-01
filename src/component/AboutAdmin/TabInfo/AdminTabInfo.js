import styles from './AdminTabInfo.module.css'
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useProduct, useProductActions } from '../../../store/DataStore';
import axios from '../../../axios';
import { GetCookie } from '../../../customFn/GetCookie';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function AdminTabInfo({setMiddleCategory, setLowCategory, setSelectedCategory}){
  const product = useProduct();
  const {setProduct, resetProduct} = useProductActions();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [flag, setFlag] = useState(false);
  const [img, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [manyFlag, setManyFlag] = useState(false);

  const customUploadAdapter = (loader) => { // (2)
      return {
          upload(){
              return new Promise ((resolve, reject) => {
                  const data = new FormData();
                  const url = `http://localhost:5050/`
                  loader.file.then( (file) => {
                          data.append("image", file); // 변경된 부분: "file" -> "image"

                          axios.post('/product/upload', data, {
                            withCredentials: false,
                            headers: {
                              'Content-Type': 'multipart/form-data',
                            }
                          })
                              .then((res) => {
                                  if(!flag){
                                      setFlag(true);
                                      setImage(res.data.imageUrl);
                                    }
                                  resolve({
                                      default: `${url}/${res.data.fileName}`
                                  });
                              })
                              .catch((err)=>reject(err));
                      })
              })
          }
      }
  }

  function uploadPlugin (editor){ // (3)
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return customUploadAdapter(loader);
      }
  }


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddFile = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post('/product/upload/excel', formData, {
          withCredentials: false,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        alert(response.data.message);
        navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/searchProduct");
        window.location.reload();
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        console.error('파일 업로드 에러:', error);
      }
    } else {
      console.error('파일을 선택하세요.');
    }
  };
  
  //데이터 불러오기
  const { data } = useQuery({queryKey:['data']});

  //등록 fetch 함수
  const fetchAddData = async (newData) => {
    if(data.find((item) => item.product_id === product.product_id )){
      try {
        const token = GetCookie('jwt_token');
        const response = await axios.patch("/product/edit", 
          JSON.stringify(
            newData
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
    } else {
      try {
        const response = await axios.post("/product/create", 
          JSON.stringify(
            newData
          ),
          {
            headers : {
              "Content-Type" : "application/json",
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('상품을 추가하는 중 오류가 발생했습니다.');
      }
    }
  };

  //상품 등록 함수
  const { mutate:addProductMutate } = useMutation({mutationFn: fetchAddData})

  function handleAddedProduct(){
    let newProduct;
    if(data.find((item) => item.product_id === product.product_id )){
      newProduct = product;
    } else {
      newProduct = {
        ...product,
        parentsCategory_id: product.category.middleId,
        category_id: product.category.lowId,
      }
    }
    addProductMutate(newProduct,{
    onSuccess: (data) => {
      // 메세지 표시
      alert(data.message);
      console.log('상품이 추가/변경 되었습니다.', data);
      // 상태를 다시 불러와 갱신합니다.
      queryClient.invalidateQueries(['data']);
      navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/searchProduct");
    },
    onError: (error) => {
      // 상품 추가 실패 시, 에러 처리를 수행합니다.
      console.error('상품을 추가/변경 하는 중 오류가 발생했습니다.', error);
    },
  })
  }

  // 상품정보 데이터
  const productInfo = [
    {label: '상품코드', value: <input className={styles.input} value={product.product_id} onChange={(e)=>setProduct("product_id", e.target.value)} type='text' placeholder='A001-10001'/>},
    {label: '브랜드', value: <input className={styles.input} value={product.product_brand} onChange={(e)=>setProduct("product_brand", e.target.value)} type='text' placeholder='한국브랜드'/>},
    {label: '원산지', value: <input className={styles.input} value={product.product_madeIn} onChange={(e)=>setProduct("product_madeIn", e.target.value)} type='text' placeholder='국산'/>},
    {label: '판매상태',value: 
    <select className={styles.input} value={product.product_state} onChange={(e)=>setProduct("product_state", e.target.value)}>
      <option>판매대기</option>
      <option>판매중</option>
      <option>판매중단</option>
      <option>판매종료</option>
      <option>품절</option>
    </select>}
  ]

  return(
    <div className={styles.tabInnerHeader}>

    {/* 탭 상품 정보 */}
    <h5 style={{fontWeight: '650'}}>상품 정보</h5>
    <div className={styles.productDetail}>
    {productInfo.map((item, index) => 
      <div key={index} className={styles.productDetailInner}>
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
        config={{ // (4)
          extraPlugins: [uploadPlugin],
          baseHref: 'http://localhost:5050/', // CKEditor의 기본 경로 설정
          extraAllowedContent: 'img[src,alt]', // 추가로 허용되는 콘텐츠
        }}
        editor={ ClassicEditor }
        data={product.product_content}
        onReady={ ( editor ) => {
          console.log( "CKEditor5 React Component is ready to use!", editor );
        } }
        onChange={ ( event, editor ) => {
          const data = editor.getData();
          setProduct('product_content', data);
        } }
        />
      </div>
    </div>


    {/* 버튼 부분들 (등록하기, 초기화, 임시저장) */}
    <div className={styles.textButton}>
      <button 
      className={styles.mainButton}
      onClick={()=>handleAddedProduct()}
      > {data.find((item) => item.product_id === product.product_id ) ?
        '수정하기' : '등록하기'}
      </button>
      <div className={styles.sideTextButton}>
        <button 
        className={styles.sideButton}
        onClick={()=>{
          resetProduct()
          setMiddleCategory([]);
          setLowCategory([]);
          setSelectedCategory({ big: null, medium: null, small: null });
        }}
        >
          초기화
        </button>
        <button
        className={styles.sideButton}
        onClick={()=>setManyFlag(!manyFlag)}>
          대량등록 {manyFlag ? '비활성화' : '활성화'} 버튼
        </button>
      </div>
      {manyFlag 
        &&
        <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', marginTop: '1em'}}> 
        <input 
        className={styles.input}
        onChange={handleFileChange}
        accept='*'
        type='file'>
        </input>
        <button
        className={styles.sideButton}
        onClick={()=>handleAddFile()}>
          업로드
        </button>
        </div>}
    </div>
  </div>
  )
        }