import { useState } from "react";
import { AdminProductFilter } from "../Product/AdminProductFilter";
import React from "react";
import styles from "./AdminProductList.module.css";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProductFilter } from "../../../store/DataStore";
import axios from "../../../axios";
import { useFetch } from "../../../customFn/useFetch";
import Pagination from "../../../customFn/Pagination";
export function AdminProductList() {
  //Td 선택시 Modal State 변수
  const [selectedData, setSelectedData] = useState(null);

  const navigate = useNavigate();

  //상품 필터 Zustand State
  const productFilter = useProductFilter();

  const queryClient = useQueryClient();

  //Fetch Custom Hooks
  const { fetchServer, fetchGetServer } = useFetch();

  //현재 페이지와 전체 페이지 개수 State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 상품에 대한 전체 페이지 개수 지정
   * @returns 전체 상품 데이터 조회
   * - discount_amount - 상품의 총 할인율
   * - option0 ~ 9 - 상품 옵션
   * - category_id - 상품의 소 카테고리
   * - parentsCategory_id : 상품의 부모(중) 카테고리
   * - product_amount : 상품 총액 (고유 할인 적용)
   * - product_brand : 상품 브랜드
   * - product_content : 상품 정보(설명)
   * - product_created : 상품 생성일
   * - product_discount : 상품 할인율
   * - product_id : 상품 고유 번호
   * - product_image_original : 이미지 링크
   * - product_isDeleted : 상품 삭제 여부
   * - product_madeIn : 상품 원산지
   * - product_model : 상품 모델명
   * - product_price : 상품 표준가
   * - product_spec : 상품 규격
   * - product_state : 상품 상태 (Ex: 새 상품, 중고 상품... ETC)
   * - product_supply : 상품 재고
   * - product_title : 상품명
   * - product_updated : 상품 최근 수정일
   */
  const fetchData = async () => {
    const data = await fetchGetServer("/product/list", 1);
    setCurrentPage(data.currentPage);
    setTotalPages(data.totalPages);
    return data.data;
  };

  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["product"],
    queryFn: () => fetchData(),
  });

  /**
   * - Mutation Hook 이용
   *
   * @param {*} pageNumber 변경할 페이지 넘버
   * @returns Fetch Post / 변경할 페이지에 해당하는 상품 데이터 반환
   */
  const fetchPageChange = async (pageNumber) => {
    return await fetchServer({}, "post", "/product/list", pageNumber);
  };

  const { mutate: pageMutaion } = useMutation({ mutationFn: fetchPageChange });

  /**
   * -- 페이지 변경 Mutation 선언 함수
   * - setCurrentPage - 현재 페이지 재 지정
   * - setTotalPages - 전체 페이지 수 재 지정
   * @param {*} pageNumber 변경할 페이지 넘버
   */
  function handlePageChange(pageNumber) {
    pageMutaion(pageNumber, {
      onSuccess: (data) => {
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(["product"], () => {
          return data.data.data;
        });
      },
      onError: (error) => {
        return console.error(error.message);
      },
    });
  }

  /**
   * - 상품 / 상품 고유번호를 가져와 수정 페이지로 이동하는 함수
   * @param {*} item 상품 데이터 (@불러오기 의 returns 데이터 정보 참조)
   */
  function handleEditItem(item) {
    navigate(
      `/sadkljf$ewulihfw_mcnjcbvjaskanshcbjancasuhbj/editProduct/${item.product_id}`
    );
  }

  /**
   * - 상품명을 클릭한 경우 해당 아이템의 정보를 불러오는 Modal을 불러옴
   * @param {*} itemId - 해당 상품의 고유번호 (item.product_id)
   */
  const handleItemClick = (itemId) => {
    if (selectedData === itemId) {
      // 이미 선택된 아이템을 클릭한 경우 모달을 닫음
      setSelectedData(null);
    } else {
      setSelectedData(itemId);
    }
  };

  /*---------- 필터 검색 ----------*/

  /**
   * @필터 POST FETCH
   * - 필터 검색 Mutation (react-query :: Mutation Hook) 사용
   * @param {*} filter 객체 정보
   * - category: {highId: '', middleId: '', lowId: ''} - 상 카테고리, 중 카테고리, 하 카테고리
   * - date: {start: '', end: ''} - 시작일자와 끝 일자
   * - dateType: "" - 날짜 형식
   * - product_brand: "" - 상품 브랜드
   * - product_id: "" - 상품 코드
   * - product_supply: "" - 상품 재고
   * - product_title: "" - 상품명
   * - state: Array(0) - 상품 상태
   */
  const fetchFilteredProducts = async (filter) => {
    return await fetchServer(filter, `post`, `/product/filter`, 1);
  };

  const { mutate: filterMutation } = useMutation({
    mutationFn: fetchFilteredProducts,
  });

  /**
   * @검색 Mutation 선언부
   * 조건
   * - 판매 상태는 적어도 1개 이상 체크하여야 함!
   * - 대 카테고리는 색인 X, 적어도 중 카테고리까지 선택하여야 정상 검색됨.
   * @returns 필터된 상품의 데이터 객체 (@불러오기 returns 데이터 정보 참조)
   */
  const handleSearch = () => {
    if (productFilter.state.length === 0) {
      alert("판매 상태는 적어도 1개 이상은 체크하여야 합니다!");
      return;
    }
    if (
      productFilter.category.highId !== "" &&
      productFilter.category.middleId === ""
    ) {
      alert(
        "주의 ! : 대 카테고리만은 상품에 색인되지 않습니다. \n중 카테고리까지 선택하여야 필터링이 적용됩니다!"
      );
    }
    // 검색 버튼 클릭 시에만 서버에 요청
    filterMutation(productFilter, {
      onSuccess: (data) => {
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        queryClient.setQueryData(["product"], () => {
          return data.data.data;
        });
      },
      onError: (error) => {
        return console.error(error.message);
      },
    });
  };

  /**
   * @삭제 DELETE FETCH
   * - deleteProductMutation (react-query :: Mutation Hook) 이용
   * - 파라미터에 상품 고유번호를 삽입
   *
   * @param {*} productId 상품 고유번호(item.product_id)
   * @returns
   */
  const fetchDeletedProducts = async (productId) => {
    try {
      const response = await axios.delete(`/product/delete/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 상품 삭제를 처리하는 뮤테이션
  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: fetchDeletedProducts,
  });

  /**
   * @삭제핸들러 Mutation 선언부
   * - isConfirmed : window.confirm을 이용한 재 확인 절차
   * - 확인 시 파라미터에 item.product_id를 전송하여 삭제 API 요청
   * @param {*} item 삭제 할 상품 데이터(@불러오기 상품 데이터 정보 참고)
   */
  const handleDeleted = (item) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (isConfirmed) {
      deleteProductMutation(item.product_id, {
        onSuccess: (data) => {
          alert(data.message);
          // 상품 삭제 성공 시 상품 목록을 다시 불러옴
          queryClient.invalidateQueries(["data"]);
        },
        onError: (error) => {
          // 상품 삭제 실패 시, 에러 처리를 수행합니다.
          console.error("상품을 삭제 처리하는 중 오류가 발생했습니다.", error);
        },
      });
    }
  };

  /**
   * @옵션 옵션0~9 불러오기 함수
   *
   * @param {*} item 상품 데이터(@불러오기 return 데이터 정보 참조)
   * @returns
   */
  const optionCreator = (item) => {
    let options = [];
    for (let i = 0; i < 10; i++) {
      const optionValue = item[`option${i}`];
      if(optionValue && optionValue.trim() !== "") // Checks if option is not null, undefined, or just whitespaces
        options.push(optionValue);
    }
    return (
      <select defaultValue="">
        <option value="">선택</option> {/* Assuming "선택" means "select" or "choose", and making its value empty */}
        {options.map((option, key) => (
          <option key={key} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };
  

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className="LargeHeader">상품 조회</div>
        <AdminProductFilter handleSearch={handleSearch} />
        <div className={styles.tableLocation}>
          <table>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품코드</th>
                <th>상세보기</th>
                <th>상품명</th>
                <th>단위</th>
                <th>표준가</th>
                <th style={{ fontWeight: "bold" }}>공급가</th>
                <th>더보기</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <React.Fragment key={index}>
                  <tr className={styles.list}>
                    <td>
                      <img
                        className={styles.thumnail}
                        src={item.product_image_original}
                        alt="이미지"
                      ></img>
                    </td>
                    <td>{item.product_id}</td>
                    <td
                      className={styles.detailView}
                      onClick={() => navigate(`/detail/${item.product_id}`)}
                    >
                      상세보기
                    </td>
                    <td
                      className={styles.detailView}
                      onClick={() => handleItemClick(item.product_id)}
                    >
                      <h5 style={{ fontSize: "1.1em", fontWeight: "550" }}>
                        {item.product_title}
                      </h5>
                    </td>
                    <td>EA</td>
                    <td>
                      {item.product_discount
                        ? `${parseInt(item.product_price).toLocaleString(
                            "ko-KR",
                            { style: "currency", currency: "KRW" }
                          )}`
                        : parseInt(item.product_price).toLocaleString("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                          })}
                    </td>
                    <td style={{ fontWeight: "750" }}>
                      {item.product_discount
                        ? `${(
                            item.product_price -
                            (item.product_price / 100) * item.product_discount
                          ).toLocaleString("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                          })}`
                        : `${parseInt(item.product_price).toLocaleString(
                            "ko-KR",
                            { style: "currency", currency: "KRW" }
                          )}`}
                    </td>
                    <td
                      className={styles.detailView}
                      onClick={() => handleItemClick(item.product_id)}
                    >
                      더보기&nbsp;
                      {selectedData === item.product_id ? (
                        <i className="fa-sharp fa-solid fa-caret-up"></i>
                      ) : (
                        <i className="fa-sharp fa-solid fa-caret-down"></i>
                      )}
                      &nbsp;
                    </td>
                  </tr>
                  {/* 모달 */}
                  {selectedData === item.product_id && (
                    <tr>
                      <td colSpan="8">
                        <table className={styles.colTable}>
                          <thead
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            <tr>
                              <th style={{ width: "25%" }}>브랜드</th>
                              <th style={{ width: "10%" }}>옵션</th>
                              <th style={{ width: "20%" }}>재고</th>
                              <th style={{ width: "10%" }}>적용률</th>
                              <th style={{ width: "10%" }}>할인금액</th>
                              <th style={{ width: "10%", fontWeight: "650" }}>
                                공급가
                              </th>
                              <th>
                                <button
                                  className={styles.button}
                                  onClick={() => handleDeleted(item)}
                                >
                                  삭제
                                </button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{item.product_brand}</td>
                              <td>{optionCreator(item)}</td>
                              <td>{item.product_supply}</td>
                              <td>
                                {100 - parseFloat(item.product_discount)}%
                              </td>
                              <td style={{ fontWeight: "550" }}>
                                {item.product_discount
                                  ? `${(
                                      (item.product_price / 100) *
                                      item.product_discount
                                    ).toLocaleString("ko-KR", {
                                      style: "currency",
                                      currency: "KRW",
                                    })}`
                                  : parseInt("0").toLocaleString("ko-KR", {
                                      style: "currency",
                                      currency: "KRW",
                                    })}
                              </td>
                              <td style={{ fontWeight: "750" }}>
                                {item.product_discount
                                  ? `${(
                                      item.product_price -
                                      (item.product_price / 100) *
                                        item.product_discount
                                    ).toLocaleString("ko-KR", {
                                      style: "currency",
                                      currency: "KRW",
                                    })}`
                                  : `${parseInt(
                                      item.product_price
                                    ).toLocaleString("ko-KR", {
                                      style: "currency",
                                      currency: "KRW",
                                    })}`}
                              </td>
                              <td>
                                <button
                                  className={styles.button}
                                  onClick={() => handleEditItem(item)}
                                >
                                  수정
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
