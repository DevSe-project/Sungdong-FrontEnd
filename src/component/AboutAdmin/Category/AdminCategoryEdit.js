import { useNavigate, useParams } from 'react-router-dom';
import styles from './AdminCategoryEdit.module.css'
import { AdminHeader } from '../Layout/Header/AdminHeader'
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData'
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProduct, useProductActions } from '../../../store/DataStore';
import { GetCookie } from '../../../customFn/GetCookie';
import axios from '../../../axios';
export function AdminCategoryEdit() {
  const [middleCategory, setMiddleCategory] = useState([]);
  const [lowCategory, setLowCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({ big: null, medium: null, low: null });
  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });
  const { data } = useQuery({ queryKey: ['data'] });
  const product = useProduct();
  const { editProduct } = useProductActions();
  const queryClient = useQueryClient();
  //주소창 입력된 id값 받아오기
  let { id } = useParams();
  const loadData = () => {
    if (data) {
      //입력된 id과 data내부의 id값 일치하는 값 찾아 변수 선언
      const datas = data.find((product) => product.product_id === id);
      return datas;
    } else {
      return <div>데이터를 불러오는 중이거나 상품을 찾을 수 없습니다.</div>;
    }
  }

  useEffect(() => {
    return () => {
      window.location.reload();
      // 컴포넌트가 언마운트될 때 Product 상태 리셋 및 새로고침
    };
  }, []);

  //데이터 불러오기 이전 loadData()함수 실행 금지
  useEffect(() => {
    const fetchData = async () => {
      if (data !== null) {
        await editProduct(loadData());
      }
    };

    fetchData();
  }, [isLoading]);

  const sendCategoryToServer = async () => {
    try {
      const token = GetCookie('jwt_token');
      const response = await axios.put("/product/categoryEdit",
        JSON.stringify({
          product_id: product.product_id,
          category_id: selectedCategory.low,
          parentsCategory_id: selectedCategory.medium
        }),
        {
          headers: {
            "Content-Type": "application/json",
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
  }
  //상품 수정 함수
  const { mutate: editCategoryMutation } = useMutation({ mutationFn: sendCategoryToServer })

  function handleConfirmCategory() {
    if (selectedCategory.low !== null && selectedCategory.low !== "") {
      editCategoryMutation({}, {
        onSuccess: (data) => {
          // 메세지 표시
          alert(data.message);
          console.log('해당 상품의 카테고리가 추가/변경 되었습니다.', data);
          // 상태를 다시 불러와 갱신합니다.
          queryClient.invalidateQueries(['data']);
          navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/category")
        },
        onError: (error) => {
          // 상품 추가 실패 시, 에러 처리를 수행합니다.
          console.error('카테고리를 추가/변경 하는 중 오류가 발생했습니다.', error);
        },
      });
    } else {
      alert("소 카테고리까지 모두 선택 후 변경하여 주십시오!")
    }
  }

  const handleCategoryClick = (categoryType, category) => {
    setSelectedCategory(prevState => ({
      ...prevState,
      [categoryType]: category,
    }));
  };

  function FilteredHighCategoryData() {
    return categoryData.filter(element => /^[A-Z]$/.test(element.category_id))
  }

  function FilteredMiddleCategoryData(itemId) {
    const newData = categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.category_id));
    setMiddleCategory(newData);
  }

  function FilteredLowCategoryData(itemId) {
    const newData = categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.category_id));
    setLowCategory(newData);
  }


  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.main}>
      <div className={styles.tableLocation}>
        <h1 style={{ marginBottom: '0.5em' }}>선택한 상품</h1>
        <table className={styles.table}>
          <thead
            style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            <tr>
              <th>이미지</th>
              <th>상품코드</th>
              <th>현재 카테고리</th>
              <th>상품명</th>
              <th>표준가</th>
              <th style={{ fontWeight: '650' }}>공급가</th>
            </tr>
          </thead>
          <tbody>
            {data
              ?
              <tr className={styles.list}>
                <td><img className={styles.thumnail} src={product.product_image_original} alt='이미지'></img></td>
                <td>{product.product_id}</td>
                <td style={{ fontWeight: 650 }}>
                  {[categoryData.find((category) => category.category_id === product.parentsCategory_id)?.name, categoryData.find((category) => category.category_id === product.category_id)?.name].filter(Boolean).join(' - ')}
                </td>
                <td>
                  <h5 style={{ fontSize: '1.1em', fontWeight: '550' }}>{product.product_title}</h5>
                </td>
                <td>{parseInt(product.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}</td>
                <td style={{ fontWeight: '750' }}>
                  {product.product_discount
                    ? `${(product.product_price - (product.product_price / 100) * product.product_discount)
                      .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                    : `${product.product_price.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                </td>
              </tr>
              : <tr><td>로딩중</td></tr>
            }
          </tbody>
        </table>
        <hr style={{ marginTop: '3em' }} />
        <div className={styles.changedCategory}>
          <div style={{ width: '100%', borderBottom: '3px dotted lightgray', marginBottom: '3em' }}>
            <h1>현재 카테고리</h1>
            <p style={{ fontSize: '2em', fontWeight: '750' }}>
              {[categoryData.find((category) => category.category_id === product.parentsCategory_id)?.name, categoryData.find((category) => category.category_id === product.category_id)?.name].filter(Boolean).join(' - ')}
            </p>
          </div>
          <h1>변경할 카테고리</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            <h4 style={{ fontSize: '1.1em', fontWeight: '750', marginTop: '1em' }}>
              선택된 카테고리 :
              <span style={{ color: '#CC0000', fontWeight: '650', margin: '0.5em' }}>
                {[categoryData.find((item) => item.category_id === selectedCategory.big)?.name, categoryData.find((item) => item.category_id === selectedCategory.medium)?.name, categoryData.find((item) => item.category_id === selectedCategory.low)?.name].filter(Boolean).join(' - ')}
              </span>
            </h4>
            <div style={{ display: 'flex', gap: '1em', marginTop: '1em', alignItems: 'center' }}>
              <div className={styles.categoryContainer}>
                <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                  {categoryData
                    && FilteredHighCategoryData().map((item, index) => (
                      <div onClick={() => {
                        setLowCategory([]);
                        handleCategoryClick('big', item.category_id);
                        handleCategoryClick('medium', '');
                        handleCategoryClick('low', '');
                        FilteredMiddleCategoryData(item.category_id)
                      }}
                        key={index}
                        className={styles.categoryInner}
                        style={{ backgroundColor: selectedCategory.big === item.category_id && 'lightgray' }}
                      >
                        {item.name}
                        <i className="far fa-chevron-right" style={{ color: 'gray' }} />
                      </div>
                    ))}
                </div>
              </div>
              <div className={styles.categoryContainer}>
                <div style={{ overflowY: 'auto' }}>
                  {middleCategory != null && middleCategory.map((item, index) => (
                    <div
                      onClick={() => {
                        FilteredLowCategoryData(item.category_id)
                        handleCategoryClick('medium', item.category_id);
                        handleCategoryClick('low', '');
                      }}
                      key={index}
                      style={{ backgroundColor: selectedCategory.medium === item.category_id && 'lightgray' }}
                      className={styles.categoryInner}>
                      {item.name}
                      <i className="far fa-chevron-right" style={{ color: 'gray' }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.categoryContainer}>
                <div style={{ overflowY: 'auto' }}>
                  {lowCategory != null && lowCategory.map((item, index) => (
                    <div
                      key={index}
                      className={styles.categoryInner}
                      style={{ backgroundColor: selectedCategory.low === item.category_id && 'lightgray' }}
                      onClick={() => {
                        handleCategoryClick('low', item.category_id);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonBox}>
            <button onClick={() => handleConfirmCategory()} className={styles.selectedButton}>변경</button>
            <button onClick={() => navigate("/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/category")} className={styles.selectButton}>취소</button>
          </div>
        </div>
      </div>
    </div>
  )
}