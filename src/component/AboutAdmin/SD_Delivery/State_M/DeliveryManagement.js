
import { AdminHeader } from '../../Layout/Header/AdminHeader';
import { AdminMenuData } from '../../Layout/SideBar/AdminMenuData';
import Deli_Filter from '../Filter/Deli_Filter';
import Deli_InquireTable from '../InquireTable/Deli_InquireTable';
import styles from './DeliveryManagement.module.css';


export default function DeliveryManagement() {



    return (
        // Full Screen
        <div>

            <AdminHeader />

            {/* Body */}
            <div className={styles.body}>

                <AdminMenuData />

                {/* Main */}
                <div className={styles.main}>

                    {/* Post */}
                    <div className='LargeHeader'> 배송 상태 관리  </div>

                    {/* Filter Container */}
                    <Deli_Filter />

                    {/* Delivery InquireTable Header */}
                    <Deli_InquireTable />

                </div>

            </div>

        </div>
    )
}