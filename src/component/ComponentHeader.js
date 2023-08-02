import logo from '../image/logo.jpeg'
import styles from '../ComponentHeader.module.css'
export function ComponentHeader(){
  return(
    <>
      <div className={styles.header}>
        <img src={logo} height='80px'/>
      </div> 
    </>
  )
}