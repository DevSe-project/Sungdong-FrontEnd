import logo from '../image/logo.jpeg'
import styles from '../ComponentHeader.module.css'
import { useNavigate } from 'react-router-dom'
import { TopBanner} from './TopBanner';
export function ComponentHeader(){
  const navigate = useNavigate();
  return(
    <>
      <div className={styles.header}>
        <img className={styles.image} onClick={()=>navigate("/")} src={logo} height='80px'/>
        <TopBanner/>
      </div> 
    </>
  )
}