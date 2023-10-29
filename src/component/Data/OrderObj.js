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
export let OrderObj = [
    {
        // 1. userId 일치 여부 확인 ( 주문목록 진입 시 )
        // 2. 주문상품의 id와 전체 상품 데이터의 id를 find, 주문 목록에 불러옴
        orderId : 0,
        productId : 1,
        image : {
            mini: image2_mini,
            original : image2_original,
          },
        userId: "", 
        productName :"안전화",
        optionSelected : "260",
        cnt : 4,
        price: 150000,
        finprice: 600000,
        orderState: 1,
        date: "2023년 8월 12일",
        order: {
            name : "장민욱",
            tel : "010-1234-5678",
            payRoute : "CMS",
            moneyReceipt : "명세서",
            transAction : "명세서출력",
            fax : "1244-2145"
        },
        delivery: {
            deliverySelect : "대한통운",
            deliveryType : "일반택배",
            deliveryDate : "2023년 08월 14일",
            address : {
                address : {
                    roadAddress : "삼산로 55번길",
                    bname : "삼산동",
                    buildingName : "성동물산"
                },
                addressDetail : "성동물산 1층"
            }
        },
    },
] 
