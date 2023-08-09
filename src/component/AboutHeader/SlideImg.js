import { useEffect, useMemo, useState } from 'react';
import styles from './SlideImg.module.css'
import readyimage from '../../image/page_ready.png'
export function SlideImg() {
  //의존성 배열 Warning 메세지 해결 -
  // useMemo사용 - 의존성이 변경될 때만 다시 계산
    const images = useMemo(() => [
      readyimage,
      readyimage,
      readyimage,
    ], []);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const slideTimer = setInterval(() => {
        // 이미지 인덱스를 변경하여 다음 이미지로 슬라이드
        setCurrentImageIndex((indexZero) => ((indexZero + 1) % images.length)); //%(나머지)이므로 1%3 => 1반환, 2%3 => 2반환, 3%3 => 0반환
      }, 3000);
  
      // 컴포넌트가 언마운트되면 타이머를 해제하여 메모리 누수 방지
      return () => clearInterval(slideTimer);
    }, [images]);
  
  return(
    <div className={styles.sliderContainer}>
      {/* transform : translateX(-100%,-200%,-300%) -> x축방향으로 이동 */}
      <div className={styles.sliderTrack} style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
        {/* 이미지들을 옆으로 이동시키기 위해 slider-track */}
        {images.map((url, index) => (
          <img key={index} src={url} alt={`슬라이드 화면 ${index}번`} className={styles.slide} />
        ))}
      </div>
    </div>
  );
};
