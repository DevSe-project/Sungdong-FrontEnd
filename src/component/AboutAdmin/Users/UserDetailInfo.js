import { useEffect } from "react";
import { useModalActions, useModalState } from "../../../store/DataStore";
import styles from './UserDetailInfo.module.css';
import useManagerUser from "./customFn/useManageUser";

export default function UserDetailInfo({ info }) {
  const { modalName } = useModalState(0);
  const { selectedModalClose } = useModalActions();
  const { parseOptionValue } = useManagerUser();

  // ESC 키로 모달 종료
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        selectedModalClose(modalName);
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    }
  }, [modalName, selectedModalClose]);

  return (
    <div className="modalOverlay">
      {/* 본문 영역 */}
      <div className="modalContainer">
        {/* 종료 버튼 */}
        <div className="exitButton">
          <span onClick={() => {
            selectedModalClose(modalName);
          }}>
            <i className="fas fa-times"></i>
          </span>
        </div>
        {/* 내용 */}
        {info && <div>
          {/* Header 기본 정보 */}
          <div className="MediumHeader">기본 정보</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.th}>담당자명</th>
                <td>{info.name}</td>
                <th className={styles.th}>담당자 연락처</th>
                <td>{info.tel}</td>
              </tr>
              <tr>
                <th className={styles.th}>문자 수신 동의</th>
                <td>{info.smsService ? '동의함' : '동의안함'}</td>
                <th className={styles.th}>이메일</th>
                <td>{info.email}</td>
              </tr>
              <tr>
                <th className={styles.th}>Email 수신 동의</th>
                <td>{info.emailService ? '동의함' : '동의안함'}</td>
                <th className={styles.th}>CMS 동의</th>
                <td>{info.hasCMS ? '동의함' : '동의안함'}</td>
              </tr>
            </tbody>
          </table>

          {/* Header 회사 정보 */}
          <div className="MediumHeader">회사 정보</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.th}>대표명</th>
                <td>{info.cor_ceoName}</td>
                <th className={styles.th}>사업자등록번호</th>
                <td>{info.cor_num}</td>
              </tr>
              <tr>
                <th className={styles.th}>업태</th>
                <td>{info.cor_sector}</td>
                <th className={styles.th}>업종</th>
                <td>{info.cor_category}</td>
              </tr>
              <tr>
                <th className={styles.th}>회사 연락처</th>
                <td>{info.cor_tel}</td>
                <th className={styles.th}>팩스번호</th>
                <td>{info.cor_fax}</td>
              </tr>
              <tr>
                <th className={styles.th}>등록 주소</th>
                <td>{info.address}</td>
              </tr>
            </tbody>
          </table>

          {/* Header 등록 사본 정보 */}
          <div className="MediumHeader">등록 사본</div>
          <table>
            <tbody>
              <tr>
                <th className={styles.th}>통장 사본</th>
                <td>{info.bankCopy}</td>
              </tr>
              <tr>
                <th className={styles.th}>사업자등록증 사본</th>
                <td>{info.businessLicenseCopy}</td>
              </tr>
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}
