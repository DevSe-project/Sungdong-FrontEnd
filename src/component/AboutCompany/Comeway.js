import styles from './Comeway.module.css'
import { CategoryBar } from '../AboutHeader/CategoryBar'
import { TopBanner } from '../AboutHeader/TopBanner'
import { useEffect } from 'react';
export function Comeway(props){
  // 카카오맵 API
  useEffect(() => {
  // 카카오 맵 스크립트 로드되었는지 확인
  if (window.kakao && window.kakao.maps) {
    // 카카오 맵 초기화 및 지도 생성
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(35.522540, 129.345472), // 서울의 위도, 경도
      level: 3, // 확대 레벨
    };
    const map = new window.kakao.maps.Map(container, options);


    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    const mapTypeControl = new window.kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // window.kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는 줌 컨트롤을 생성합니다
    const zoomControl = new window.kakao.maps.ZoomControl();
    map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    //지도 확대/축소 막기
    map.setZoomable(false);  

    // 마커가 표시될 위치입니다 
    const markerPosition  = new window.kakao.maps.LatLng(35.522540, 129.345472); 

    // 마커를 생성합니다
    const marker = new window.kakao.maps.Marker({
        position: markerPosition
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
    }
  }, []);


  const tabMenu = [
  {
    icon: <i style={{color:'#cc0000'}} className="fas fa-map-marker-alt"/>, 
    label: '오시는길', 
    content: '울산광역시 남구 산업로 440번길 8 (주)성동물산'
  },
  {
    icon: <i style={{color:'#cc0000'}} className="fas fa-clock"/>, 
    label: '이용시간',  
    content: {
      label: ['평일','주말'],
      content: ['08:30~18:00', '08:30~12:00']
    }
  },
  {
    icon: <i style={{color:'#cc0000'}} className="fas fa-phone-alt"/>,
    label: '전화번호', 
    content: '052-269-1840'
  },
  {
    icon: <i style={{color:'#cc0000'}} className="fas fa-user"/>, 
    label: '회사소개', 
    content: {
      label: ['상호명', '대표자', '이메일'],
      content: ['(주)성동물산', '김웅규', 'sd2691840@naver.com']
    }
  },
  ]
  return(
    <div>
      <TopBanner login={props.login} setLogin={props.setLogin} iconHovered={props.iconHovered} iconMouseEnter={props.iconMouseEnter} iconMouseLeave={props.iconMouseLeave} icon_dynamicStyle={props.icon_dynamicStyle} category_dynamicStyle={props.category_dynamicStyle} iconOnClick={props.iconOnClick} text_dynamicStyle={props.text_dynamicStyle}/>
      <CategoryBar category_dynamicStyle={props.category_dynamicStyle}/>
      <main className={styles.body}>
        <div className={styles.title}>
          <h1>오시는 길</h1>
        </div>
        <div className={styles.mapLocation}>
          <div id="map" style={{width:'80%', height: '400px'}}></div>
        </div>
      <div className={styles.mapInfo}>
        <div className={styles.mapToggle}>
          <div className={styles.mapTitle}>
            <h4>성동물산</h4>
            <h1>울산광역시 남구 산업로440번길 8 (주)성동물산</h1>
          </div>
          <div className={styles.mapButton}>
            <div>
              <a
              className={styles.mapLink}
              target='_blank' 
              href="https://map.kakao.com/link/to/성동물산,35.522540,129.345472"
              rel="noreferrer"
              ><i style={{color:'white'}} className="far fa-map-marked"/> 길찾기</a>
            </div>
            <div>
              <a 
              className={styles.mapLink}
              target='_blank' 
              href="https://map.kakao.com/link/roadview/35.522540,129.345472"
              rel="noreferrer"
              ><i style={{color:'white'}} className="far fa-road"/> 로드뷰</a>
            </div>
            <div>
              <a 
              className={styles.mapLink}
              target='_blank' 
              href="https://map.naver.com/p/entry/place/16424512?c=15.00,0,0,0,dh"
              rel="noreferrer"
              ><i style={{color:'white'}} className="fas fa-globe"/> 큰 지도로 보기</a>
            </div>  
          </div>
        </div>
          <div className={styles.companyInfo}>
            {tabMenu.map((item) => 
            <div className={styles.companyInner}>

              <div className={styles.companyLabal}>
                <p>{item.icon} {item.label}</p>
              </div>

              <div className={styles.companyContent}>
              {typeof item.content === 'string' ? (
                <div className={styles.contentInner}>
                  <p>{item.content}</p>
                </div>
                ) : (
                item.content.label.map((label,index) => (
                <div className={styles.contentInner} key={index}>
                  <p>
                    <div className={styles.col}>
                      <div style={{fontWeight: '650', color: 'gray', whiteSpace: 'nowrap'}}>{label}</div>
                      <div>{item.content.content[index]}</div>
                    </div>
                  </p>
                </div>
                  ))
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
  </div>
  )
}