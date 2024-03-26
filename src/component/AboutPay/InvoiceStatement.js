import styles from "./InvoiceStatement.module.css";
export function InvoiceStatement() {
  return (
    <div>
      <section className={styles.component}>
        <article className={styles.producer}>
          <div className={styles.titleBox}>
            <div className={styles.title}>
              <pre className={styles.h1}>거 래 명 세 서</pre>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div className={styles.lowTitle}>
                <pre>거래명세서 번호: </pre>
                <pre>(공급자 보관용)</pre>
                <pre> 년 월 일</pre>
              </div>
            </div>
          </div>
          <div className={styles.tableBox}>
            <table>
              <tr>
                <th style={{ width: "10px" }} rowSpan={3}>
                  <span>공 급 자</span>
                </th>
                <th style={{ width: "40px" }}>등 록 번 호</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>상 호</th>
                <td></td>
                <th style={{ width: "24px" }}>성명</th>
                <td></td>
              </tr>
              <tr>
                <th>주 소</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
            <table>
              <tr>
                <th style={{ width: "10px" }} rowSpan={3}>
                  <span>공 급 받 는 자</span>
                </th>
                <th style={{ width: "40px" }}>등 록 번 호</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th>상 호</th>
                <td></td>
                <th style={{ width: "24px" }}>성명</th>
                <td></td>
              </tr>
              <tr>
                <th>주 소</th>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
        </article>
        <article className={styles.supplier}></article>
      </section>
      <footer></footer>
    </div>
  );
}
