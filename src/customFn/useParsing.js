/**
 * * parseUserType
 * * parseCMS
 * * parseDeliveryType
 * * parseSelectedCor
 */
export const useParsing = () => {
  /**
   * @param {number} userType 고객유형을 전닳해주세요.
   * @returns {String} 고객 등급을 문자열 형식으로 리턴합니다.
   */
  const parseUserType = (userType) => {
    switch (parseInt(userType, 10)) { // 10진수로 변환
      case 1: return "실사용자 A등급";
      case 2: return "납품업자 A등급";
      case 12: return "실사용자 B등급";
      case 13: return "실사용자 C등급";
      case 14: return "실사용자 D등급";
      case 22: return "납품업자 B등급";
      case 23: return "납품업자 C등급";
      case 24: return "납품업자 D등급";
      case 100: return "관리자";
      default: return "Error"
    }
  };

  /**
   * @param {boolean} cms cms 값을 전달해주세요. (boolean)
   * @returns {String} CMS 동의 여부를 문자열 형식으로 리턴합니다.
   */
  const parseCMS = (cms) => {
    if (cms == 1) return "동의"
    else return "비동의"
  };

  /**
   * @param {String} orderState 주문상태를 전달해주세요.
   * @returns {String} 주문상태를 문자열 형식으로 리턴합니다.
   */
  const parseDeliveryState = (orderState) => {
    const parseVal = parseInt(orderState, 10); // 10진수 변환
    switch (parseVal) {
      case 2: return '배송 준비';
      case 3: return '배송 중';
      case 4: return '배송 완료';
      default:
        alert('배송 상태를 불러들이지 못했습니다.');
        return 'null';
    }
  };

  /**
   * @param {*} selectedCor 파싱할 택배사를 전달해주세요
   * @returns {String} 택배사를 문자열 형식으로 리턴합니다.
   */
  const parseSelectedCor = (selectedCor) => {
    switch (selectedCor) {
      case "성동택배":
        return "성동택배";
      case "대한통운":
        return "대한통운";
      case "롯데택배":
        return "롯데택배";
      case "kr.daesin":
        return "대신화물";
      case "kr.kdexp":
        return "경동화물";
      default:
        return "미정";
    }
  }

  return { parseUserType, parseCMS, parseDeliveryState, parseSelectedCor }
}