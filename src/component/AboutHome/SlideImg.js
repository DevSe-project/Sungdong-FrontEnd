import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import styles from './SlideImg.module.css';
import { useFetch } from "../../customFn/useFetch";
import { useQuery } from "@tanstack/react-query";

export function SlideImg() {
  const navigate = useNavigate();
  //Fetch Custom Hooks
  const { fetchServer, fetchGetServer } = useFetch();
    
// StaylistSlider
  
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
    const data = await fetchGetServer("/event/list", 1);
    return data.data;
  };

  const {
    isLoading,
    isError,
    error,
    data: eventData,
  } = useQuery({
    queryKey: ["event"],
    queryFn: () => fetchData(),
  });


  const imageData = eventData?.map((item) =>
    ({
      label: item.event_image,
      alt: item.event_id,
    }
    ))
  const renderSlides = imageData?.map(image => (
    <div key={image.alt} onClick={()=> navigate('/event')}>
      <img src={image.label} alt={image.alt}/>
    </div>
  ));

  const [currentIndex, setCurrentIndex] = useState();
  function handleChange(index) {
    setCurrentIndex(index);
  }

    
  if (isLoading) {
    return <p>Loading..</p>;
  }
  if (isError) {
    return <p>에러 : {error.message}</p>;
  }

  return (
    <div className={styles.img}>
      <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      selectedItem={imageData[currentIndex]}
      onChange={handleChange}
      className={styles.image} 
      >
      {renderSlides}
      </Carousel>
      <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      showThumbs={false}
      selectedItem={imageData[currentIndex]}
      onChange={handleChange} 
      className={styles.image}
      >
      {renderSlides}
      </Carousel>
    </div>
  );
};