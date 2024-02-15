import { useEffect, useState } from 'react';
import styles from './AdminCategory.module.css';
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalActions, useModalState } from '../../../store/DataStore';
import AdminCategoryAddedModal from './AdminCategoryAddedModal';
import AdminCategoryEditedModal from './AdminCategoryEditedModal';
import { useFetch } from '../../../customFn/useFetch';
import Pagination from '../../../customFn/Pagination';
export function AdminCategory({ productCurrentPage, productTotalPage }) {

  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState({ big: null, medium: null, low: null });
  const { isModal, modalName } = useModalState();
  const { selectedModalOpen, setModalName, closeModal } = useModalActions();
  const queryClient = useQueryClient();
  const { fetchServer } = useFetch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: data } = useQuery({ queryKey: ['data'] });

  useEffect(() => {
    if (data) {
      setCurrentPage(productCurrentPage);
      setTotalPages(productTotalPage);
    }
  }, [data, productCurrentPage, productTotalPage])


  // 페이지를 변경할 때 호출되는 함수
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, 'post', '/product/list', pageNumber);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange })


  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(['product'], () => {
          return data.data.data
        })
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }


  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });

  const handleCategoryClick = (categoryType, category) => {
    if (categoryType === "big") {
      setSelectedCategory(prevState => ({
        ...prevState,
        medium: null,
      }));
      setSelectedCategory(prevState => ({
        ...prevState,
        low: null,
      }));
    } else if (categoryType === "medium") {
      setSelectedCategory(prevState => ({
        ...prevState,
        low: null,
      }));
    }
    setSelectedCategory(prevState => ({
      ...prevState,
      [categoryType]: category,
    }));
  };

  //대 카테고리 필터링
  function FilteredHighCategoryData() {
    return categoryData.filter(element => /^[A-Z]$/.test(element.category_id));
  }

  //중 카테고리 필터링
  function FilteredMiddleCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[a-z]$`).test(element.category_id));
  }

  //소 카테고리 필터링
  function FilteredLowCategoryData(itemId) {
    return categoryData.filter(element => new RegExp(`^${itemId}[1-9]|[1-9][0-9]|100.{3,}$`).test(element.category_id));
  }

  //카테고리 추가에 필요한 함수
  function handleOpenMediumModal() {
    if (selectedCategory.big !== null && selectedCategory.big !== "") {
      selectedModalOpen("중");
    } else {
      alert("대 카테고리를 선택 후 추가해주세요!");
    }
  }
  function handleOpenLowModal() {
    if (selectedCategory.medium !== null && selectedCategory.medium !== "") {
      selectedModalOpen("소");
    } else {
      alert("중 카테고리를 선택 후 추가해주세요!");
    }
  }

  // 카테고리 수정에 필요한 함수
  function handleEditMediumModal() {
    if (selectedCategory.big !== null && selectedCategory.big !== "") {
      selectedModalOpen("수정 : 중");
    } else {
      alert("대 카테고리를 선택 후 추가해주세요!");
    }
  }
  function handleEditLowModal() {
    if (selectedCategory.medium !== null && selectedCategory.medium !== "") {
      selectedModalOpen("수정 : 소");
    } else {
      alert("중 카테고리를 선택 후 추가해주세요!");
    }
  }

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className='LargeHeader'>카테고리 관리</div>
        {/* 카테고리 목록 추가, 변경, 삭제 (대분류) -> (중분류) -> (소분류) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
          <h4 style={{ fontSize: '1.1em', fontWeight: 'bold', marginTop: '1em' }}>
            선택된 카테고리 :
            <span style={{ color: '#CC0000', fontWeight: 'bold', margin: '0.5em' }}>
              {[categoryData.find((item) => item.category_id === selectedCategory.big)?.name, categoryData.find((item) => item.category_id === selectedCategory.medium)?.name, categoryData.find((item) => item.category_id === selectedCategory.low)?.name].filter(Boolean).join(' - ')}
            </span>
          </h4>
          <div style={{ display: 'flex', gap: '2em' }}>
            <div className={styles.categoryContainer}>
              <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {categoryData
                  && FilteredHighCategoryData().map((item, index) => (
                    <div onClick={() => {
                      handleCategoryClick('big', item.category_id);
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
              <div className={styles.buttonBox}>
                <button onClick={() => selectedModalOpen("수정 : 대")} className={styles.button}>수정</button>
                <button onClick={() => selectedModalOpen("대")} className={styles.button}>추가</button>
              </div>
            </div>
            <div className={styles.categoryContainer}>
              <div style={{ overflowY: 'auto' }}>
                {selectedCategory.big != null
                  && FilteredMiddleCategoryData(selectedCategory.big).map((item, index) => (
                    <div
                      onClick={() => {
                        handleCategoryClick('medium', item.category_id);
                      }}
                      key={index}
                      className={styles.categoryInner}
                      style={{ backgroundColor: selectedCategory.medium === item.category_id && 'lightgray' }}
                    >
                      {item.name}
                      <i className="far fa-chevron-right" style={{ color: 'gray' }} />
                    </div>
                  ))}
              </div>
              <div className={styles.buttonBox}>
                <button className={styles.button} onClick={() => {
                  handleEditMediumModal();
                }}>수정</button>
                <button className={styles.button} onClick={() => {
                  handleOpenMediumModal();
                }}>추가</button>
              </div>
            </div>
            <div className={styles.categoryContainer}>
              <div style={{ overflowY: 'auto' }}>
                {selectedCategory.medium != null
                  && FilteredLowCategoryData(selectedCategory.medium).map((item, index) => (
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
              <div className={styles.buttonBox}>
                <button className={styles.button} onClick={() => handleEditLowModal()}>수정</button>
                <button className={styles.button} onClick={() => handleOpenLowModal()}>추가</button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tableLocation}>
          <table>
            <thead
              style={{ backgroundColor: 'white', color: 'black', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
            >
              <tr>
                <th>이미지</th>
                <th>상품코드</th>
                <th>카테고리</th>
                <th>상품명</th>
                <th>표준가</th>
                <th style={{ fontWeight: '650' }}>공급가</th>
                <th>카테고리 수정</th>
              </tr>
            </thead>
            <tbody>
              {data
                ? data.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className={styles.list}>
                      <td><img className={styles.thumnail} src={item.product_image_original} alt='이미지'></img></td>
                      <td>{item.product_id}</td>
                      <td style={{ fontSize: '1em', fontWeight: '550' }}>
                        {[categoryData.find((category) => category.category_id === item.parentsCategory_id)?.name, categoryData.find((category) => category.category_id === item.category_id)?.name].filter(Boolean).join(' - ')}
                      </td>
                      <td className={styles.detailView} onClick={() => navigate(`/detail/${item.product_id}`)}>
                        <h5 style={{ fontSize: '1.1em', fontWeight: '550' }}>{item.product_title}</h5>
                      </td>
                      <td>
                        {item.product_discount
                          ? `${parseInt(item.product_price)
                            .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                          : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                      </td>
                      <td style={{ fontWeight: '750' }}>
                        {item.product_discount
                          ? `${(item.product_price - (item.product_price / 100) * item.product_discount)
                            .toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`
                          : `${parseInt(item.product_price).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })}`}
                      </td>
                      <td
                        className={styles.detailView}
                      >
                        <button onClick={() => navigate(`/adminMain/categoryEdit/${item.product_id}`)} className={styles.button}>변경</button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
                : <tr><td>로딩중</td></tr>
              }
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
      {(modalName === "대" || modalName === "중" || modalName === "소")
        ? isModal &&
        <AdminCategoryAddedModal selectedCategory={selectedCategory} categoryData={categoryData} />
        : (modalName === "수정 : 대" || modalName === "수정 : 중" || modalName === "수정 : 소")
        && isModal &&
        <AdminCategoryEditedModal selectedCategory={selectedCategory} categoryData={categoryData} />
      }
    </div>
  )
}