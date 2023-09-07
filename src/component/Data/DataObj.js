import image1_mini from '../../image/그린솔 100.png'
import image1_original from '../../image/그린솔 300.png'
import image2_mini from '../../image/로드페이스 100.png'
import image2_original from '../../image/로드페이스 300.png'
import image3_mini from '../../image/리얼라인 100.png'
import image3_original from '../../image/리얼라인 300.png'
import image4_mini from '../../image/스마트그립 100.png'
import image4_original from '../../image/스마트그립 300.png'
import image5_mini from '../../image/썬쿨망토 100.png'
import image5_original from '../../image/썬쿨망토 300.png'
export let DataObj = [{
    id : 0,
    image : {
      mini: image1_mini,
      original : image1_original,
    },
    title : "그린솔 부식 제거 스프레이",
    price : 20000,
    content : "스프레이",
    supply : 99,
    discount: 0,
    category: {
      main: '생활건강',
      sub: '공구',
    },
    brand : '프로덕트랩',
    madeIn : '중국',
    new : true,
  },
  {
    id : 1,
    image : {
      mini: image2_mini,
      original : image2_original,
    },
    title : "작업화",
    price : 60000,
    content : "날렵한",
    discount : 0,
    supply : 99,
    brand : '프로덕트랩',
    madeIn : '중국',
    category: {
      main: '패션잡화',
      sub: '신발용품',
    },
    option : [
      {
        value: '260mm'
      },
      {
        value: '270mm'
      },
      {
        value: '280mm'
      },
      {
        value: '290mm'
      }
    ],
    new : true,
  },
  {
    id : 2,
    title : "리얼라인 골프공",
    image : {
      mini: image3_mini,
      original : image3_original,
    },
    price : 90000,
    content : "골프공",
    discount : 0,
    supply : 99,
    brand : '프로덕트랩',
    madeIn : '중국',
    category: {
      main: '스포츠레저',
      sub: '골프',
    },
    new : true,
    option : [
      {
        value: '10mm'
      },
      {
        value: '20mm'
      },
      {
        value: '30mm'
      },
      {
        value: '40mm'
      }
    ],
  },
  {
    id : 3,
    title : "[많이 팔리는 제품] 3M 장갑",
    image : {
      mini: image4_mini,
      original : image4_original,
    },
    price : 10000,
    content : "가성비 장갑",
    discount : 0,
    supply : 1,
    brand : '프로덕트랩',
    madeIn : '중국',
    category: {
      main: '패션잡화',
      sub: '장갑',
    },
    new : true,
  },
  {
    id : 4,
    title : "썬쿨망토",
    image : {
      mini: image5_mini,
      original : image5_original,
    },
    price : 30000,
    content : "시원한 망토",
    discount: 0,
    supply : 99,
    brand : '프로덕트랩',
    madeIn : '중국',
    category: {
      main: '패션의류',
      sub: '남성의류'
    },
    new : true,
  }]