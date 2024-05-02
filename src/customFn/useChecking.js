/**
 * @returns {
 * - handleItemChecking(item1, item2) : 두 아이템의 일치유무를 판단하여 true & false로 반환합니다.
 * - 
 * 
 * }
 */
export const useCheck = () => {

  /**
   * item1과 item2 값의 일치유무를 체크합니다.
   * @param {*} item1 
   * @param {*} item2 
   * @returns 
   */
  const handleItemChecking = (item1, item2) => {
    if (item1 === item2)
      return true;
    else
      return false;
  }

  const handleInputLength = (item) => {
    if (item)
      return true;
    else
      return false;
  }

  return {
    handleItemChecking,
    handleInputLength,

  }
}