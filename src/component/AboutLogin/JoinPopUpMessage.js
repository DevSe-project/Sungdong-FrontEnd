import { useEffect, useState } from "react";
import styles from './JoinPopUpMessage.module.css';

export default function JoinPopUpMessage({ popUpClose, popUpMessage }) {

  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShow(true); //창 닫는다.
      popUpClose();
    }, 2500)
    return () => clearTimeout(timeOut);
  }, []);

  return (
    <div>
      <div className={styles.popUpMessage}>
        <p>{popUpMessage}</p>
      </div>
    </div>
  )
}