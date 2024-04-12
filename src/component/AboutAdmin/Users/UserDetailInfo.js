import { useEffect } from "react"
import { useModalActions, useModalState } from "../../../store/DataStore"

export default function UserDetailInfo({info}) {

  const { modalName } = useModalState(0);
  const { selectedModalClose } = useModalActions();

  // ESC 키로 모달 종료
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if(event.key === 'Escape') {
        selectedModalClose(modalName);
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    }
  })

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        {modalName}
        상호명: {info?.cor_corName}
      </div>
    </div>
  )
}