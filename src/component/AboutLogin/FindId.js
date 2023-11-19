import styles from './Modal.module.css';

// 아이디찾기 모달창
export default function FindId(props) {

    return (
        <div>
            <div className={styles.inputContainer}>
                <div className={styles.id_layout}>
                    <div className={styles.idContainer}>
                        <div className={styles.idInput_Container}>
                            <div className={styles.nameContainer}>
                                <div className={styles.label}>대표명</div>
                                <div className={styles.input}>
                                    <input
                                        type='text'
                                        placeholder='대표명'
                                        className={styles.input}
                                        value={props.inputForFind.ceoName}
                                        onChange={(e) => {
                                            const inputCeoName = {
                                                ...props.inputForFind,
                                                ceoName: e.target.value
                                            };
                                            props.setInputForFind(inputCeoName);
                                        }}
                                        onKeyDown={props.handleEnter_idFind}
                                    />
                                </div>
                            </div>
                            <div className={styles.phoneNumContainer}>
                                <div className={styles.label}>사업자<br />등록번호</div>
                                <div className={styles.input}>
                                    <input
                                        type='text'
                                        placeholder='예)000-00-00000'
                                        className={styles.input}
                                        value={props.inputForFind.biz_num}
                                        onChange={(e) => {
                                            const inputCeoName = {
                                                ...props.inputForFind,
                                                biz_num: e.target.value
                                            };
                                            props.setInputForFind(inputCeoName);
                                        }}
                                        onKeyDown={props.handleEnter_idFind}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.reqNum} onClick={props.checking_FindId}>
                        찾기
                    </div>
                </div>
            </div>
        </div>
    )
}
