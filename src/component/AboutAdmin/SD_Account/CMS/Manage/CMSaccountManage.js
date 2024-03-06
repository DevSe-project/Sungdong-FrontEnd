import React, { useState } from 'react';
import styles from './CMSaccountManage.module.css';
import CMSFilter from '../Filter/CMSFilter';
import CMSList from '../List/CMSList';

const CMSaccountManage = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, username: 'admin1', role: 'Admin', status: 'Completed' },
    { id: 2, username: 'user1', role: 'User', status: 'Incomplete' },
  ]);

  const [filter, setFilter] = useState('Incomplete');

  const handleFilter = (status) => {
    setFilter(status);
  };

  const filteredAccounts = accounts.filter(account => {
    if (filter === 'All') return true;
    return account.status === filter;
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (a.status === 'Incomplete' && b.status === 'Completed') return -1;
    if (a.status === 'Completed' && b.status === 'Incomplete') return 1;
    return 0;
  });

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {/* body */}
      <div className={styles.body}>
        {/* Header */}
        <div className='LargeHeader'>
          <div className='HeaderTxt'>CMS 계정 관리</div>
        </div>

        {/* Main */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em'
        }}>
          <CMSFilter handleFilter={handleFilter} />

          <CMSList sortedAccounts={sortedAccounts} />
        </div>
      </div>
    </div>
  );
};

export default CMSaccountManage;
