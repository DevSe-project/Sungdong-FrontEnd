import { useState } from 'react';
import styles from '../Filter.module.css'
import { addMonths, subMonths, format } from 'date-fns';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';



export function AccountBookFilter(){
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addMonths(startDate, 1));

  function DateFilter(){
    const handleMonthChange = (event) => {
      setStartDate(new Date(2023,event.target.value,1));
      setEndDate(new Date(2023,event.target.value,31));
    };
  
    const dateList = () => {
      return Array.from({ length: 12 }, (_, index) => (
        <option key={index} value={index}>{index + 1}월</option>
      ));
    };
  
    const handleStartDateChange = (event) => {
      const newStartDate = new Date(event.target.value);
      setStartDate(newStartDate);
    };
    
    const handleEndDateChange = (event) => {
      const newStartDate = new Date(event.target.value);
      setEndDate(newStartDate);
    };
    return(
      <div style={{ display: 'flex', gap: '1em' }}>
        <select onChange={(e)=>handleMonthChange(e)}>
          {dateList()}
        </select>
        <div>
          <input 
          className={styles.button}
          type='date' 
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={(e)=>handleStartDateChange(e)}
          />
          &nbsp;~&nbsp;
          <input 
          className={styles.button}
          type='date' 
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={(e)=>handleEndDateChange(e)}
          />
        </div>
      </div>
    )
  }

  const filterList = [
    { label : '조회일자', content : DateFilter()},
    { label : '출력', content : detailSearch()},
  ]
  
  const queryClient = useQueryClient();

    //재고 감소 요청
    const dateData = async () => {
      try {
        const response = await axios.put(`/accountBook`, 
          JSON.stringify({
            startDate : startDate,
            endDate : endDate
          }),
          {
            headers : {
              "Content-Type" : "application/json",
            }
          }
        )
        // 성공 시 추가된 상품 정보를 반환합니다.
        return response.data;
      } catch (error) {
        // 실패 시 예외를 throw합니다.
        throw new Error('조건을 검색하는 중 오류가 발생했습니다.');
      }
    };

    //날짜 변경(검색) 요청 함수
    const { dateMutation } = useMutation({mutationFn: dateData,
      onSuccess: (success) => {
        console.log("조건에 맞는 조회 결과를 띄웁니다.", success);
        queryClient.invalidateQueries(['accountBook']);
      },
      onError: (error) => {
        // 상품 추가 실패 시, 에러 처리를 수행합니다.
        console.error('상품을 수정하던 중 오류가 발생했습니다.', error);
      }
    });

  return(
    <div style={{width: '100%'}}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray'}}>
          <h4 style={{fontSize: '1.2em', fontWeight: '650'}}>필터</h4>
        </div>
        {filterList.map((item) => (
        <div className={styles.container}>
          <div className={styles.label}>
            {item.label}
          </div>
          <div className={styles.content}>
            {item.content}
          </div>
        </div>
        ))}
        <div style={{display: 'flex', gap: '0.5em'}}>
          <input onClick={()=> dateMutation.mutate()} className={styles.button} type='submit' value='검색'/>
          <input className={styles.button} type='reset'/>
        </div>
      </form>
    </div>
  )
}


function detailSearch(){
  return(
    <div style={{display: 'flex', gap: '1em'}}>
      <button className={styles.button}>인쇄</button>
      <button className={styles.button}>액셀</button>
    </div>
  )
}