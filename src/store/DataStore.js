import { create } from 'zustand'

// ------------------------------데이터 STORE----------------------------//

const useDataStore = create((set) => ({
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



// ------------------------------리스트 STORE----------------------------//

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



// --------------------------------MODAL STORE--------------------------------//



// Modal State (사용법 주석 추가 예정)
const useModalStore = create((set) => ({
  isModal: false,
  modalName: '',
  selectedIndex: null,

  actions: {
    setIsModal: (bool) => set({ isModal: bool }),
    setModalName: (name) => set({ modalName: name }),
    openModal: () => set({ isModal: true }),
    closeModal: () => set({ isModal: false }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
    selectedModalOpen: (name) => set({ isModal: true, modalName: name }),
    selectedModalClose: () => set({ isModal: false, modalName: '' }),
  },
}));

// useModalState 커스텀 훅
export const useModalState = () => {
  const { isModal, modalName, selectedIndex } = useModalStore();
  return { isModal, modalName, selectedIndex };
};

// useModalActions 커스텀 훅
export const useModalActions = () => {
  const { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose } = useModalStore.getState().actions;
  return { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose };
};

/* ---------------SELECT SOTRE----------------- */
const selectStore = create((set) => ({
  select: false,
  value: '',

  actions: {
    isSelect: () => set((state) => ({ select: !state.select })),
    setValue: (val) => set((state) => ({
      value: val
    }))
  }
}));
// Custum zustand
export const useSelect = () => selectStore((state) => ({ select: state.select, value: state.value }));
export const useSelectActions = () => selectStore((state) => ({ actions: state.actions }));


/* ---------------ORDER STOREs----------------- */

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
    name: '',
    tel: '',
    address: {
      address: [],
      addressDetail: '',
    },
    deliveryType: '',
    deliverySelect: '',
    deliveryMessage: '',
    deliveryDate: '',
  },
  actions: {
    setOrderInformation: (fieldName, value) =>
      set((state) => ({ orderInformation: { ...state.orderInformation, [fieldName]: value } })),

    setDeliveryInformation: (fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [fieldName]: value } })),

    setDetailInformation: (first, fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [first]: { ...state.deliveryInformation[first], [fieldName]: value } } })),
  }
}));
export const useOrderInfo = () => useOrderStore((state) => state.orderInformation);
export const useDeliveryInfo = () => useOrderStore((state) => state.deliveryInformation);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useOrderActions = () => useOrderStore((state) => state.actions);

/* ----------------LOGIN STORE---------------- */

export const useLoginStore = create((set) => ({
  isLogin: false,

  actions: {
    setLogin: (val) => set((state) => ({ isLogin: val }))
  }
}));
export const useIsLogin = () => useLoginStore((state) => state.isLogin);
export const useSetLogin = () => useLoginStore((state) => state.actions);


/* ----------------SEARCH STORE---------------- */

export const useSearchStore = create((set) => ({
  seperateSearchTerm: {
    productName: "",
    productCode: "",
    productBrand: "",
    productOption: ""
  },
  actions: {
    setSeperateSearchTerm: (fieldName, value) =>
      set((state) => ({ seperateSearchTerm: { ...state.seperateSearchTerm, [fieldName]: value } })),
    resetSeperateSearchTerm: () =>
      set({ seperateSearchTerm: { productName: "", productCode: "", productBrand: "", productOption: "" } }),
  }
}));
export const useSeperateSearchTerm = () => useSearchStore((state) => state.seperateSearchTerm);
export const useSearchActions = () => useSearchStore((state) => state.actions);

/* ----------------TAKEBACK STORE---------------- */
export const useTakeBackStore = create((set) => ({
  takeBackOption: {
    returnStatus: "",
    barcodeStatus: "",
    wrapStatus: "",
    productStatus: ""
  },
  actions: {
    setTakeBackOption: (fieldName, value) =>
      set((state) => ({ takeBackOption: { ...state.takeBackOption, [fieldName]: value } })),
    resetTakeBackOption: () =>
      set({ takeBackOption: { returnStatus: "", barcodeStatus: "", wrapStatus: "", productStatus: "" } }),
  }
}));
export const useTakeBack = () => useTakeBackStore((state) => state.takeBackOption);
export const useTakeBackActions = () => useTakeBackStore((state) => state.actions);

