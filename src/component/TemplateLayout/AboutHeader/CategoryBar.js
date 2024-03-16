import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CategoryBar.module.css'
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalActions, useSearchActions } from '../../../store/DataStore';
import { useFetch } from '../../../customFn/useFetch';

export function CategoryBar(props) {
  const { isLoading, isError, error, data: categoryData } = useQuery({ queryKey: ['category'] });
  const { selectedModalClose } = useModalActions();
  const {setFilterData} = useSearchActions();

  const [activeTab, setActiveTab] = useState(null); // 현재 활성화된 탭을 추적
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //서브메뉴 열림창 변수 초기화
  const [subMenuStates, setSubMenuStates] = useState(categoryData?.length > 0 ? categoryData.map(() => false) : []);

  // 방법 1 - for문
  // const handleSubMenuOnOff = (index) => {
  //   // 해당 인덱스의 메뉴를 열기 위해 true로 설정
  //   const newSubMenuStates = [...subMenuStates];
  //   // 열려있는 다른 서브메뉴를 닫기
  //   for (let i = 0; i < newSubMenuStates.length; i++) {
  //     if (i !== index) {
  //       newSubMenuStates[i] = false;
  //     }
  //   }
  //   // 클릭한 인덱스의 서브메뉴를 열거나 닫기
  //   newSubMenuStates[index] = !subMenuStates[index];

  //   setSubMenuStates(newSubMenuStates);
  // };
  // 방법 2 - mapping
  function toggleSubMenu(index) {
    setSubMenuStates(prevStates => {
      const newSubMenuStates = prevStates.map((state, idx) => idx === index ? !state : false);
      return newSubMenuStates;
    });
  }

  const {fetchAddPostServer} = useFetch();

  // 카테고리를 클릭했을 때 호출되는 함수
  const fetchFilterCategory = async (categoryId) => {
    const getSearch = JSON.parse(sessionStorage.getItem('searchTerm'));
    return await fetchAddPostServer([getSearch.state.searchTerm, getSearch.state.seperateSearchTerm, categoryId], 'post', '/search/list', 1, 10);
  };

  const { mutate: filterMutaion } = useMutation({ mutationFn: fetchFilterCategory })


  function handleSearch(type, categoryId) {
    let idData;
    if (type === 'parents') {
      idData = {
        parentsCategory_id: categoryId
      }
    } else if(type === 'children') {
      idData = {
        category_id: categoryId
      }
    } else {
      idData = categoryId
    }
    filterMutaion(idData, {
      onSuccess: (data) => {
        setFilterData(data.data.datas);
        selectedModalClose();
        queryClient.setQueryData(['search'], () => {
          return data.data
        })
        navigate("/category");
      },
      onError: (error) => {
        return console.error(error.message);
      },
    })
  }

  // esc키를 누르면 모달창 닫기.
  useEffect(() => {
    const exit_esc = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(); // "Esc" 키 누를 때 모달 닫기 함수 호출
      }
    };

    window.addEventListener('keydown', exit_esc);

    return () => {
      window.removeEventListener('keydown', exit_esc);
    };
  }, [selectedModalClose]);

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }
  return (
    <div className={styles.customModalOverlay}>
      <div className={styles.customModalContainer}>
        <div className={styles.categoryBarContainer}
          style={{ ...props.category_dynamicStyle }}>
          {/* 아이콘 hovered */}
          {
            categoryData.length > 0
              ? categoryData.map((item, index) =>
                item.parentsCategory_id === null &&
                (
                  <li
                    key={index}
                    className={`categorymenu-item ${subMenuStates[index] && 'open'} + categorytab-item ${activeTab === item.category_id ? 'active' : ''}`}
                    onClick={() => { 
                      toggleSubMenu(index); 
                    }}
                  >
                    <span style={{fontSize: '20px', textOverflow: 'ellipsis'}}>
                      {item.name}
                    </span>
                    {/* 서브메뉴 loop */}
                    {subMenuStates[index] && (
                      <ul className="sub-menu">
                        <div className={styles.subMenuContainer}>
                          {categoryData && categoryData
                            .filter((category) => category.parentsCategory_id === item.category_id)
                            .map((category, subIndex) => (
                              <div className={styles.listStyle} key={subIndex}>
                                <li
                                  onClick={()=> handleSearch('parents', category.category_id)}
                                  className={styles.category}
                                >
                                  {category.name}
                                </li>
                                <ul className={styles.listStyle_low}>
                                  {categoryData && categoryData
                                    .filter((lowCategory) => lowCategory.parentsCategory_id === category.category_id)
                                    .map((low, lowIndex) => (
                                      <li 
                                      key={lowIndex} 
                                      className={styles.category_low}
                                      onClick={()=> handleSearch('children', low.category_id)}
                                      >
                                        {low.name}
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>
                            ))}
                        </div>
                      </ul>
                    )}
                  </li>
                ))
              : '로딩중'}
        </div>
      </div>
    </div>
  )
}