import { useEffect, useRef, useState } from 'react'
import { Delivery } from './Delivery'
import styles from './DeliveryMain.module.css'
import { useOrderData } from '../../store/DataStore'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFetch } from '../../customFn/useFetch';
export function DeliveryMain(props){

  const [searchTerm, setSearchTerm] = useState("");
  const [resultSearch, setResultSearch] = useState("");
  const [resultLength, setResultLength] = useState("");
  const {fetchServer} = useFetch();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchSearch(searchKey){
    return await fetchServer({search: searchKey}, `post`, `/order/search`, 1)
  }

  const {mutate: searchMutation} = useMutation({mutationFn: fetchSearch})
  // 검색 로직
  const handleSearch = (search) => {
    // 입력 값을 저장하는 로직
    searchMutation(search, {
      onSuccess: (data)=> {
        console.log(data);
        alert(data.message);
        setCurrentPage(data.data.currentPage);
        setTotalPages(data.data.totalPages);
        setResultSearch(searchTerm);
        setResultLength(data.data.totalRows);
        queryClient.setQueryData(['order'],() => {
          return data.data.data;
        })
        setSearchTerm("");
      },
      onError: (error)=>{
        return console.error(error.message);
      }
    })
  };

  function handleKeyDown(event) {
    if(event.key === "Enter"){
      handleSearch(searchTerm);
      return;
    }
  }

  return(
    <div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>주문/배송</h1>
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <input 
            className={styles.searchInput} 
            type='text' 
            placeholder='검색어를 입력하세요. (품명,브랜드,규격,모델명,상품코드 중 하나)'
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown} // onKeyDown 이벤트 핸들러 추가
            />
            <i 
            className="fas fa-search"
            onClick={()=> {
              handleSearch(searchTerm)
            }}/>
          </div>
        </div>
      </div>
      <Delivery currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} setTotalPages={setTotalPages} resultSearch={resultSearch} resultLength={resultLength}/>
    </div>
  )
}