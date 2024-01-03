
import { AdminHeader } from '../Layout/Header/AdminHeader';
import { AdminMenuData } from '../Layout/SideBar/AdminMenuData';
import Deli_Filter from './Deli_Filter';
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
                    <div className={styles.main_post}>
                        배송 상태 관리
                    </div>
                    {/* Filter Container */}
                    <Deli_Filter />



                    {/* Delivery List Container */}
                    <div className={styles.delivery_list_container}>
                        {/* Delivery List Header */}
                        <div className={styles.list_header}>
                            {/* Post */}
                            <div className={styles.list_post}>
                                목록
                            </div>
                            {/* Number of Denote */}
                            <div className={styles.DenoteNum}>
                                <select>
                                    <option>10</option>
                                    <option>30</option>
                                    <option>50</option>
                                </select>
                            </div>
                        </div>



                        {/* List Conatiner */}
                        <div className={styles.list_container}>
                            {/* List */}
                            <div className={styles.list}>

                            </div>
                            {/* Move Page */}
                            <div className={styles.move_page}>

                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}