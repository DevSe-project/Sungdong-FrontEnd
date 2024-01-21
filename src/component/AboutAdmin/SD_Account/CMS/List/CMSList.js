export default function CMSList({sortedAccounts}) {


    return (
        <div className="contentBody">
            {/* MediumHeader */}
            <div className='MediumHeader'>
                <div className='HeaderTxt'>회원 목록</div>
            </div>

            {/* UserList */}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>사용자명</th>
                        <th>역할</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAccounts &&
                        sortedAccounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.id}</td>
                                <td>{account.username}</td>
                                <td>{account.role}</td>
                                <td>{account.status}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}