import { useEffect } from 'react';
import { useEventFilter, useEventFilterActions } from '../../../store/DataStore'
import styles from './AdminEventFilter.module.css'
import { useQuery } from '@tanstack/react-query';
export function AdminEventFilter({ handleSearch }) {
  const eventFilter = useEventFilter();
  const { setEventFilter, resetEventFilter, setEventDate, setCheckboxState, setAllCheckboxState } = useEventFilterActions();

  useEffect(() => {
    return () => {
      resetEventFilter();
      // 컴포넌트가 언마운트될 때 Product 필터 상태 리셋
    };
  }, []);

  const handleCheckboxChange = (name) => {
    setCheckboxState(name);
  };

  /**
   * @날짜필터
   * - created : 상품 등록일을 기준으로 필터링
   * - updated : 상품 최근 수정일을 기준으로 필터링
   */
  function dateFilter() {
    return (
      <div style={{ display: 'flex', gap: '1em' }}>
        <select className={styles.select} value={eventFilter.dateType} onChange={(e) => setEventFilter('dateType', e.target.value)}>
          <option value="">선택</option>
          <option value={'event_startDate'}>이벤트 시작일</option>
          <option value={'event_endDate'}>이벤트 종료일</option>
        </select>
        <div>
          <input className={styles.select} type='date' value={eventFilter.date.start} onChange={(e) => setEventDate('start', e.target.value)}></input>
          &nbsp;~&nbsp;
          <input className={styles.select} type='date' value={eventFilter.date.end} onChange={(e) => setEventDate('end', e.target.value)}></input>
        </div>
      </div>
    )
  }

  /**
   * @상태필터
   * 전체, 판매대기, 판매중, 판매완료, 판매중단 5개의 필터 구성
   * @returns 판매 상태에 따른 필터링 select - oprion 리턴
   */
  function saleStatus() {
    const selectAll = eventFilter.state.length === 4;
    return (
      <div style={{ display: 'flex', gap: '0.5em' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value="전체"
              checked={selectAll}
              onChange={(e) => {
                setAllCheckboxState(selectAll);
              }}
            />
            전체
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value={1}
              checked={eventFilter.state.includes(1)}
              onChange={(e) => {
                handleCheckboxChange(Number(e.target.value));
              }}
            />
            준비
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value={2}
              checked={eventFilter.state.includes(2)}
              onChange={(e) => {
                handleCheckboxChange(Number(e.target.value));
              }}
            />
            진행중
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value={4}
              checked={eventFilter.state.includes(4)}
              onChange={(e) => {
                handleCheckboxChange(Number(e.target.value));
              }}
            />
            종료
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              name="상태"
              value={3}
              checked={eventFilter.state.includes(3)}
              onChange={(e) => {
                handleCheckboxChange(Number(e.target.value));
              }}
            />
            중단
          </label>
        </div>
      </div>
    )
  }

  const filterList = [
    { label: '이벤트상태', content: saleStatus() },
    { label: '기간', content: dateFilter() },
  ]

  return (
    <div style={{ width: '100%' }}>
      <form className={styles.main}>
        <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray' }}>
          <h4 style={{ fontSize: '1.2em', fontWeight: '650' }}>필터</h4>
        </div>
        {filterList.map((item, index) => (
          <div key={index} className={styles.container}>
            <div className={styles.label}>
              {item.label}
            </div>
            <div className={styles.content}>
              {item.content}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5em' }}>
          <button className={styles.button} onClick={(e) => {
            e.preventDefault();
            handleSearch()
          }}>
            검색  
          </button>
          <button className={styles.button} onClick={() => {
            resetEventFilter()
            window.location.reload();
            }}>
            초기화
          </button>
        </div>
      </form>
    </div>
  )
}


