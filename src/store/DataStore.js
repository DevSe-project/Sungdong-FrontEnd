import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDataStore = create((set)=>({
  orderData: null,
  categoryData: [],
  userData: [],
  todayTopicData: null,


  actions: {

    setOrderData: (input) =>
      set((prev) => ({
        orderData: input
      })),
    // 카테고리

    setCategoryData: (input) =>
      set((prev) => ({
        categoryData: input
      })),
    // 고객정보

    setUserData: (input) =>
      set((prev) => ({
        userData: input
      })),
    // 오늘의 주제

    setTodayTopicData: (input) =>
      set((prev) => ({
        todayTopicData: input
      }))
  }
}));

// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
// export const useData = () => useDataStore((state) => state.data);
export const useOrderData = () => useDataStore((state) => state.orderData);
export const useCategoryData = () => useDataStore((state) => state.categoryData);
export const useUserData = () => useDataStore((state) => state.userData);
export const useTopicData = () => useDataStore((state) => state.todayTopicData);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useDataActions = () => useDataStore((state) => state.actions);



// --------------------------------------------------------------------//

const useListStore = create((set) => ({
  wishList: [],
  orderList: [],
  basketList: [],
  noticePostList: [],


  actions: {
    setWishList: (val) =>
      set((prev) => ({
        wishList: val
      })),
    // 주문

    setOrderList: (val) =>
      set((state) => ({
        orderList: val
      })),
    // 장바구니

    setBasketList: (val) =>
      set((state) => ({
        basketList: val
      })),
    // 공지사항
    // 공지사항
    setNoticePostList: (val) => {
      set((state) => ({
        noticePostList: val,
      }))
    },
  }
}))



// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
export const useWishList = () => useListStore((state) => state.wishList);
export const useBasketList = () => useListStore((state) => state.basketList);
export const useOrderList = () => useListStore((state) => state.orderList);
export const useNoticePostList = () => useListStore((state) => state.noticePostList);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useListActions = () => useListStore((state) => state.actions);



// --------------------------------------------------------------------//



// Modal State
const useModalStore = create((set) => ({
  // 초기값: 모달이 열리지 않은 상태라는 뜻이로 false 할당
  isModalOpen: false,
  // 초기값: 모달의 이름이 없다는 뜻으로 공백을 할당
  modalName: '',
  // 초기값: 선택되지 않았다는 듯으로 null을 할당
  selectedIndex: null,


  // on/off만 있는 모달창을 오픈
  openModal: (name) => set({ isModalOpen: true, modalName: name }),
  // on/off만 있는 모달창을 클로즈
  closeModal: () => set({ isModalOpen: false, modalName: '' }),
  setSelectedIndex: (index) => set({ selectedIndex: index }),
  // index에 해당하는 모달 창을 열어야 할 경우
  selectedModalOpen: (name) => set({ isModalOpen: true, modalName: name }),
  // index에 해당하는 모달 창을 닫아야 할 경우(추가로 close함수에 해당 모달 창의 내용을 초기화 하는 코드는 개별적으로 작성)
  selectedModalClose: () => set({ isModalOpen: false, modalName: '' })
}));


// 커스텀하여 useModal로 사용
export const useModal = () => {
  const {
    isModalOpen,
    modalName,
    selectedIndex,
    openModal,
    closeModal,
    setSelectedIndex,
    selectedModalOpen,
    selectedModalClose
  } = useModalStore();

  return {
    isModalOpen,
    modalName,
    selectedIndex,
    openModal,
    closeModal,
    setSelectedIndex,
    selectedModalOpen,
    selectedModalClose
  };
};

/* -------------------------------- */

const useOrderStore = create((set) => ({
  orderInformation: {
    name: '',
    tel: '',
    email: '',
    smtMessage: '',
    payRoute: '',
    moneyReceipt: '',
    transAction: '',
    fax: '',
    checked: false,
  },
  deliveryInformation: {
    name : '',
    tel : '',
    address : {
      address : [],
      addressDetail : '',
    },
    deliveryType : '',
    deliverySelect: '',
    deliveryMessage : '',
    deliveryDate : '',
  },
  actions :{
    setOrderInformation: (fieldName, value) =>
      set((state) => ({ orderInformation: { ...state.orderInformation, [fieldName]: value } })),

    setDeliveryInformation: (fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation,[fieldName]: value } })),

    setDetailInformation: (first, fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [first]: { ...state.deliveryInformation[first], [fieldName]: value } }})),     
  }
}));
export const useOrderInfo = () => useOrderStore((state) => state.orderInformation);
export const useDeliveryInfo = () => useOrderStore((state) => state.deliveryInformation);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useOrderActions = () => useOrderStore((state) => state.actions);