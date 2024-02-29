import styles from './CMSFilter.module.css';

export default function CMSFilter({ handleFilter }) {


    return (
        <div style={{ width: '100%' }}>
            <div className="filterBody">
                <div style={{ width: '90%', textAlign: 'left', padding: '1.5em', borderBottom: '1px solid lightgray' }}>
                    <h4 style={{ fontSize: '1.2em', fontWeight: '650' }}>필터</h4>
                </div>
                <div style={{
                    display: 'flex',
                    marginBottom: '10px',
                    gap: '10px'
                }}>
                    <button
                        className='white_button'
                        onClick={() => handleFilter('All')}
                    >
                        모두 보기
                    </button>
                    <button
                        className='white_button'
                        onClick={() => handleFilter('Completed')}
                    >
                        정산 완료
                    </button>
                    <button
                        className='white_button'
                        onClick={() => handleFilter('Incomplete')}
                    >
                        정산 미완료
                    </button>
                </div>
            </div>
        </div >
    )
}