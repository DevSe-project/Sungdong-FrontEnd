import { AdminMainListModule } from "./AdminMainListModule";
import styles from "./AdminMain.module.css";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "../../../customFn/useFetch";
import AdminNoticeMini from "./AdminNoticeMini";
export function AdminMainModule() {
  function depositIcon() {
    return (
      <i
        style={{ fontSize: "2em", color: "green" }}
        className="fas fa-won-sign"
      ></i>
    );
  }
  function cancelIcon() {
    return (
      <i
        style={{ fontSize: "2em", color: "lightBlue" }}
        className="fas fa-undo-alt"
      ></i>
    );
  }

  function deliveryIcon() {
    return (
      <i
        style={{ fontSize: "2em", color: "#0000CC" }}
        className="fas fa-truck"
      ></i>
    );
  }

  function productIcon() {
    return (
      <i
        style={{ fontSize: "2em", color: "#CC0000" }}
        className="fas fa-box-alt"
      ></i>
    );
  }
  //Fetch Custom Hooks
  const { fetchServer, fetchGetServer } = useFetch();

  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 페이지 개수 지정
   * @returns 전체 이벤트 조회
   * - event_id - 이벤트 고유번호
   * - event_image : 이벤트 이미지
   * - event_content : 이벤트 정보(설명)
   * - event_title : 이벤트 타이틀명
   * - event_startDate : 이벤트 시작일
   * - event_endDate : 이벤트 종료일
   */
  const fetchData = async () => {
    const data = await fetchGetServer("/rae/admin/module", 1);
    return data;
  };

  const {
    isLoading,
    isError,
    error,
    data: moduleData,
  } = useQuery({
    queryKey: ["moduleRae"],
    queryFn: () => fetchData(),
  });

  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 페이지 개수 지정
   * @returns 전체 이벤트 조회
   * - event_id - 이벤트 고유번호
   * - event_image : 이벤트 이미지
   * - event_content : 이벤트 정보(설명)
   * - event_title : 이벤트 타이틀명
   * - event_startDate : 이벤트 시작일
   * - event_endDate : 이벤트 종료일
   */
  const fetchOrderData = async () => {
    const data = await fetchGetServer("/order/admin/module", 1);
    return data;
  };

  const { data: orderData } = useQuery({
    queryKey: ["moduleOrder"],
    queryFn: () => fetchOrderData(),
  });

  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 페이지 개수 지정
   * @returns 전체 이벤트 조회
   * - event_id - 이벤트 고유번호
   * - event_image : 이벤트 이미지
   * - event_content : 이벤트 정보(설명)
   * - event_title : 이벤트 타이틀명
   * - event_startDate : 이벤트 시작일
   * - event_endDate : 이벤트 종료일
   */
  const fetchDeliveryData = async () => {
    const data = await fetchGetServer("/delivery/admin/module", 1);
    return data;
  };

  const { data: deliveryData } = useQuery({
    queryKey: ["moduleDelivery"],
    queryFn: () => fetchDeliveryData(),
  });

  /**
   * @불러오기
   * 페이지를 불러올 때 선언되는 GET FETCH
   * - setCurrentPage - 현재 페이지 개수 지정
   * - setTotalPages - 전체 페이지 개수 지정
   * @returns 전체 이벤트 조회
   * - event_id - 이벤트 고유번호
   * - event_image : 이벤트 이미지
   * - event_content : 이벤트 정보(설명)
   * - event_title : 이벤트 타이틀명
   * - event_startDate : 이벤트 시작일
   * - event_endDate : 이벤트 종료일
   */
  const fetchProductData = async () => {
    const data = await fetchGetServer("/product/admin/module", 1);
    return data;
  };

  const { data: productData } = useQuery({
    queryKey: ["moduleProduct"],
    queryFn: () => fetchProductData(),
  });

  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.main}>
      {/* -- Section_1 : 상단 */}
      <section className={styles.top}>
        {/* || Article_1 : 주문, 취소, 배송, 상품 */}
        <article className={styles.product}>
          {/* 입금 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule
              icon={depositIcon()}
              firstName={"입금대기"}
              secondName={"신규주문"}
              thirdName={"오늘출발"}
              first={orderData && orderData[0]?.noPay}
              second={orderData && orderData[0]?.pay}
              third={orderData && orderData[0]?.todayDelivery}
            />
          </div>

          {/* 취소 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule
              icon={cancelIcon()}
              firstName={"반품요청"}
              secondName={"교환요청"}
              thirdName={"취소요청"}
              first={moduleData && moduleData[0]?.refund}
              second={moduleData && moduleData[0]?.exchange}
              third={moduleData && moduleData[0]?.cancel}
            />
          </div>

          {/* 배송 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule
              icon={deliveryIcon()}
              firstName={"배송준비"}
              secondName={"배송중"}
              thirdName={"배송완료"}
              first={deliveryData && deliveryData[0]?.prepare}
              second={deliveryData && deliveryData[0]?.shipping}
              third={deliveryData && deliveryData[0]?.complete}
            />
          </div>

          {/* 상품 */}
          <div className={styles.productSeparate}>
            <AdminMainListModule
              icon={productIcon()}
              firstName={"판매준비"}
              secondName={"판매중"}
              thirdName={"품절"}
              first={productData && productData[0]?.prepare}
              second={productData && productData[0]?.selling}
              third={productData && productData[0]?.soldout}
            />
          </div>
        </article>

        {/* || Article_2 : 공지사항 */}
        <article className={styles.notice}>
          <AdminNoticeMini />
        </article>
      </section>

      {/* -- Section_2 : 하단 */}
      <section className={styles.bottom}>
        {/* || Article_1 : 방문자 수 통계 */}
        <article className={styles.visitor}></article>

        {/* || Article_2 : 유저 */}
        <article className={styles.users}></article>
      </section>
    </div>
  );
}
