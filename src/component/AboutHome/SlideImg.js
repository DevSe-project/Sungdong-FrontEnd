import React, { useState } from "react";
import image1 from '../../image/[이벤트]-오렌지방한장갑.png'
import image2 from '../../image/[이벤트]-착착테이프.png'
import image3 from '../../image/[이벤트]국산방진마스크.png'
import { useNavigate } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export function SlideImg() {
  const navigate = useNavigate();
// StaylistSlider

const imageData = [
  {
    label: image1,
    alt: "image1",
  },

  {
    label: image2,
    alt: "image2",
  },

  {
    label: image3,
    alt: "image3",
  }
];
const renderSlides = imageData.map(image => (
  <div key={image.alt} onClick={()=> navigate('/event')}>
    <img src={image.label} alt={image.alt}/>
  </div>
));

const [currentIndex, setCurrentIndex] = useState();
function handleChange(index) {
  setCurrentIndex(index);
}

  return (
    <div style={{display: 'flex', justifyContent:'center', gap:'1em'}}>
      <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      width={550}
      showThumbs={false}
      selectedItem={imageData[currentIndex]}
      onChange={handleChange} >
      {renderSlides}
      </Carousel>
      <Carousel
      showArrows={true}
      autoPlay={true}
      infiniteLoop={true}
      width={550}
      showThumbs={false}
      selectedItem={imageData[currentIndex]}
      onChange={handleChange} >
      {renderSlides}
      </Carousel>
    </div>
  );
};