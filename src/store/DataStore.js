import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

// ------------------------------데이터 STORE----------------------------//

const useDataStore = create((set) => ({
  orderData: null,
  categoryData: [],
  userData: [],
  todayTopicData: null,
  detailData: [],

  actions: {
    setDetailData: (input) => //주문,배송 현황에서 주문 상세보기에 사용
      set((prev) => ({
        detailData: input
      })),

    setOrderData: (input) => //주문을 끝난 후 상품 주문 데이터들 표기에 사용
      set((prev) => ({
        orderData: input
      })),
    // 카테고리

    setCategoryData: (input) => //Category에서 상품들 Data에 사용
      set((prev) => ({
        categoryData: input
      })),

    // 고객정보
    setUserData: (input) => //Receipt에서 UserData 사용
      set((prev) => ({
        userData: input
      })),
    // 오늘의 주제
    setTodayTopicData: (input) =>
      set((prev) => ({
        todayTopicData: input
      }))
  }
}))


// 💡 커스텀 훅 사용 -> 
// 선택자 생성, 상태가 변경될 때마다 구성요소가 업데이트 되기 때문에 반복적 렌더링 방지, 
// 실수로 전체 스토어를 렌더링 하는 일 방지.
export const useDetailData = () => useDataStore((state) => state.detailData);
export const useOrderData = () => useDataStore((state) => state.orderData); // 주문을 마친 후 상품데이터가 들어가는 State
export const useCategoryData = () => useDataStore((state) => state.categoryData);
export const useUserData = () => useDataStore((state) => state.userData);
export const useTopicData = () => useDataStore((state) => state.todayTopicData);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useDataActions = () => useDataStore((state) => state.actions);



// ------------------------------리스트 STORE----------------------------//

//사용 리스트 : 찜, 검색결과, 견적함, 주문, 장바구니, 공지사항
const useListStore = create((set) => ({
  wishList: [],
  orderList: [],
  cartList: [],
  searchList: [],
  estimateList: [],
  noticePostList: [],


  actions: {
    //찜
    setWishList: (val) =>
      set((prev) => ({
        wishList: val
      })),

    //검색결과
    setSearchList: (val) =>
      set((state) => ({
        searchList: val
      })),

    resetSearchList: (val) =>
      set((state) => ({
        searchList: []
      })),

    //견적함
    setEstimateList: (val) =>
      set((state) => ({
        estimateList: val
      })),

    resetEstimateList: (val) =>
      set((state) => ({
        estimateList: []
      })),

    //검색리스트 옵션 SET
    setSearchOption: (item, value) =>
      set((state) => ({
        searchList: state.searchList.map((list) => {
          if (list.product_id === item.product_id) {
            return {
              ...list,
              selectedOption: value,
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 SET
    setEstimateCnt: (item, value) =>
      set((state) => ({
        estimateList: state.estimateList.map((list) => {
          if (list.estimateBox_product_id === item.estimateBox_product_id) {
            return {
              ...list,
              estimateBox_cnt: value,
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 UP
    setEstimateCntUp: (item) =>
      set((state) => ({
        estimateList: state.estimateList.map((list) => {
          if (list.estimateBox_product_id === item.estimateBox_product_id) {
            return {
              ...list,
              estimateBox_cnt: (parseInt(list.estimateBox_cnt) + 1).toString(),
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 DOWN
    setEstimateCntDown: (item) =>
      set((state) => ({
        estimateList: state.estimateList.map((list) => {
          if (list.estimateBox_product_id === item.estimateBox_product_id) {
            return {
              ...list,
              estimateBox_cnt: (parseInt(list.estimateBox_cnt) - 1).toString(),
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 SET
    setSearchCnt: (item, value) =>
      set((state) => ({
        searchList: state.searchList.map((list) => {
          if (list.product_id === item.product_id) {
            return {
              ...list,
              cnt: value,
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 UP
    setSearchCntUp: (item) =>
      set((state) => ({
        searchList: state.searchList.map((list) => {
          if (list.product_id === item.product_id) {
            return {
              ...list,
              cnt: (parseInt(list.cnt ? list.cnt : 0) + 1).toString(),
            };
          }
          return list;
        }),
      })),

    //검색리스트 수량 DOWN
    setSearchCntDown: (item) =>
      set((state) => ({
        searchList: state.searchList.map((list) => {
          if (list.product_id === item.product_id) {
            return {
              ...list,
              cnt: (parseInt(list.cnt ? list.cnt : 0) - 1).toString(),
            };
          }
          return list;
        }),
      })),

    // 주문
    setOrderList: (val) =>
      set((state) => ({
        orderList: val
      })),

    resetCartList: (val) =>
      set((state) => ({
        orderList: []
      })),

    // 장바구니
    setCartList: (data) =>
      set((state) => ({
        cartList: [
          ...data.map((item) => ({ ...item })),
        ],
      })),

    //카트수량 SET
    setCartCnt: (item, value) =>
      set((state) => ({
        cartList: state.cartList.map((list) => {
          if (list.cart_product_id === item.cart_product_id) {
            return {
              ...list,
              cart_cnt: value,
            };
          }
          return list;
        }),
      })),

    //카트수량 UP
    setCartCntUp: (item) =>
      set((state) => ({
        cartList: state.cartList.map((list) => {
          if (list.cart_product_id === item.cart_product_id) {
            return {
              ...list,
              cart_cnt: (parseInt(list.cart_cnt) + 1).toString(),
            };
          }
          return list;
        }),
      })),

    //카트수량 DOWN
    setCartCntDown: (item) =>
      set((state) => ({
        cartList: state.cartList.map((list) => {
          if (list.cart_product_id === item.cart_product_id) {
            return {
              ...list,
              cart_cnt: (parseInt(list.cart_cnt) - 1).toString(),
            };
          }
          return list;
        }),
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
export const useSearchList = () => useListStore((state) => state.searchList);
export const useCartList = () => useListStore((state) => state.cartList);
export const useOrderList = () => useListStore((state) => state.orderList);
export const useNoticePostList = () => useListStore((state) => state.noticePostList);
export const useEstimateList = () => useListStore((state) => state.estimateList);

// 🎉  모든 액션 상태를 위한 한개의 선택자 생성 -> 상태가 자주 변경되지 않기 때문에 모든 액션상태를 모음.
export const useListActions = () => useListStore((state) => state.actions);



// --------------------------------MODAL STORE--------------------------------//



// Modal State (사용법 주석 추가 예정)
const useModalStore = create((set) => ({
  isModal: false,
  modalName: '',
  selectedIndex: null,
  modalItem: [],

  actions: {
    setIsModal: (bool) => set({ isModal: bool }),
    setModalName: (name) => set({ modalName: name }),
    openModal: () => set({ isModal: true }),
    closeModal: () => set({ isModal: false }),
    setSelectedIndex: (index) => set({ selectedIndex: index }),
    selectedModalOpen: (name) => set({ isModal: true, modalName: name }),
    selectedModalOpenInItem: (name, item) => set({ isModal: true, modalName: name, modalItem: item }),
    selectedModalClose: () => set({ isModal: false, modalName: '' }),
    setModalItem: (fieldName, value) =>
      set((state) => ({ modalItem: { ...state.modalItem, [fieldName]: value } })),
  },
}));

// useModalState 커스텀 훅
/**
 * @keys
 * - isModal
 * - modalName
 * - selectedIndex
 * - modalItem
 */
export const useModalState = () => {
  const { isModal, modalName, modalItem, selectedIndex } = useModalStore();
  return { isModal, modalName, selectedIndex, modalItem };
};

// useModalActions 커스텀 훅
/**
 * @keys
 * - actions
 * - setIsModal
 * - setModalName
 * - openModal
 * - closeModal
 * - setSelectedIndex
 * - selectedModalOpen
 * - selectedModalClose
 * - selectedModalOpenInItem
 * - setModalItem
 */
export const useModalActions = () => {
  const { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose, selectedModalOpenInItem, setModalItem } = useModalStore.getState().actions;
  return { setIsModal, setModalName, setSelectedIndex, openModal, closeModal, selectedModalOpen, selectedModalClose, selectedModalOpenInItem, setModalItem };
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


/* ---------------ORDER STORE----------------- */

//주문서 작성 STORE
const useOrderStore = create((set) => ({
  orderInformation: {
    order_name: '',
    order_tel: '',
    order_email: '',
    smtMessage: '',
    order_delName: '',
    order_delTel: '',
    address: [],
    addressDetail: '',
    order_payRoute: '',
    order_payName: '',
    order_moneyReceipt: '',
    printFax: false,
    order_faxNum: '',
    checked: false,
    isCart: false,
  },
  deliveryInformation: {
    deliveryType: '',
    delivery_selectedCor: '',
    delivery_message: '',
    delivery_date: null,
  },
  actions: {
    setOrderInformation: (fieldName, value) =>
      set((state) => ({ orderInformation: { ...state.orderInformation, [fieldName]: value } })),

    setDeliveryInformation: (fieldName, value) =>
      set((state) => ({ deliveryInformation: { ...state.deliveryInformation, [fieldName]: value } })),

    setDetailInformation: (first, fieldName, value) =>
      set((state) => ({ orderInformation: { ...state.orderInformation, [first]: { ...state.orderInformation[first], [fieldName]: value } } })),
    resetOrderInfo: () =>
      set({
        orderInformation: {
          order_name: '',
          order_tel: '',
          order_email: '',
          smtMessage: '',
          order_delName: '',
          order_delTel: '',
          address: '',
          addressDetail: '',
          order_payRoute: '',
          order_payName: '',
          order_moneyReceipt: '',
          printFax: false,
          order_faxNum: '',
          checked: false,
        },
        deliveryInformation: {
          deliveryType: '',
          delivery_selectedCor: '',
          delivery_message: '',
          delivery_date: null,
        }
      }),
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

//검색창 STATE
export const useSearchStore = create(
  persist(
    (set) => ({
      filterData: [],
      searchTerm: {
        search: ""
      },
      seperateSearchTerm: {
        product_id: "",
        product_title: "",
        product_brand: "",
        product_spec: "",
        product_model: ""
      },
      actions: {
        setFilterData: (val) =>
          set((prev) => ({
            filterData: val
          })),
        setSearchTerm: (fieldName, value) =>
          set((state) => ({ searchTerm: { ...state.searchTerm, [fieldName]: value } })),
        setSeperateSearchTerm: (fieldName, value) =>
          set((state) => ({ seperateSearchTerm: { ...state.seperateSearchTerm, [fieldName]: value } })),
        resetSeperateSearchTerm: () =>
          set({ seperateSearchTerm: { product_id: "", product_title: "", product_brand: "", product_spec: "", product_model: "" } }),
        resetSearchTerm: () =>
          set({ searchTerm: { search: "" } }),
      }
    }),
    {
      name: 'searchTerm',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      partialize: (state) => ({ seperateSearchTerm: state.seperateSearchTerm, searchTerm: state.searchTerm, filterData: state.filterData }),
    }
  )
);
export const useSearchFilterData = () => useSearchStore((state) => state.filterData);
export const useSearchTerm = () => useSearchStore((state) => state.searchTerm);
export const useSeperateSearchTerm = () => useSearchStore((state) => state.seperateSearchTerm);
export const useSearchActions = () => useSearchStore((state) => state.actions);

/*-----------------ESTIMATE STORE----------------*/
//견적서 작성 STORE
export const useEstimateStore = create(
  persist(
    (set) => ({
      estimateData: {
        estimate_amountDiscount: 0, //총 금액 할인율
        estimate_due: '', //납기일
        estimate_expire: '', //견적 유효기간
        estimate_isIncludeVAT: 'false', //부가세 구분
        estimate_etc: '', //비고
        supplier: {
          estimate_corName: '',
          estimate_managerName: '',
          estimate_address: '',
          estimate_cor_ceoName: '',
          estimate_cor_tel: '',
          estimate_cor_fax: '',
          estimate_email: ''
        },
        vendor: {
          estimate_corName: '',
          estimate_managerName: '',
          estimate_address: '',
          estimate_cor_ceoName: '',
          estimate_cor_tel: '',
          estimate_cor_fax: '',
          estimate_email: ''
        }
      },
      estimateProductData: [],
      estimateInfo: [],
      estimateProduct: [],
      actions: {
        setProductData: (value) =>
          set((state) => ({ estimateProductData: value })),
        setEstimateInfo: (value) =>
          set((state) => ({ estimateInfo: value })),
        setEstimateProduct: (value) =>
          set((state) => ({ estimateProduct: value })),
        setProfit: (items, value) =>
          set((state) => ({
            estimateProductData: state.estimateProductData.map((list) => {
              if (items.some((item) => item.estimateBox_product_id === list.estimateBox_product_id)) {
                return {
                  ...list,
                  product_profit: value,
                };
              }
              return list;
            }),
          })),
        setProductEtc: (items, value) =>
          set((state) => ({
            estimateProductData: state.estimateProductData.map((list) => {
              if (items.estimateBox_product_id === list.estimateBox_product_id) {
                return {
                  ...list,
                  product_etc: value,
                };
              }
              return list;
            }),
          })),
        setTsInfo: (items, value) =>
          set((state) => ({
            estimateProductData: state.estimateProductData.map((list) => {
              if (items.estimateBox_product_id === list.estimateBox_product_id) {
                return {
                  ...list,
                  product_ts: value,
                };
              }
              return list;
            }),
          })),
        setEstimateData: (fieldName, value) =>
          set((state) => ({ estimateData: { ...state.estimateData, [fieldName]: value } })),
        setVendorData: (fieldName, value) =>
          set((state) => ({
            estimateData: {
              ...state.estimateData,
              vendor: {
                ...state.estimateData.vendor,
                [fieldName]: value,
              },
            },
          })),
        setSupplierData: (fieldName, value) =>
          set((state) => ({
            estimateData: {
              ...state.estimateData,
              supplier: {
                ...state.estimateData.supplier,
                [fieldName]: value,
              },
            },
          })),
        resetEstimateData: () =>
          set({
            estimateData: {
              estimate_amountDiscount: 0, //총 금액 할인율
              estimate_due: '', //납기일
              estimate_expire: '', //견적 유효기간
              estimate_isIncludeVAT: 'false', //부가세 구분
              estimate_etc: '', //비고
              supplier: {
                estimate_corName: '',
                estimate_managerName: '',
                estimate_address: '',
                estimate_cor_ceoName: '',
                estimate_cor_tel: '',
                estimate_cor_fax: '',
                estimate_email: ''
              },
              vendor: {
                estimate_corName: '',
                estimate_managerName: '',
                estimate_address: '',
                estimate_cor_ceoName: '',
                estimate_cor_tel: '',
                estimate_cor_fax: '',
                estimate_email: ''
              }
            }
          }),
        resetEstimateProductData: () =>
          set({ estimateProductData: [] }),
        resetEstimateInfo: () =>
          set({ estimateInfo: [] }),
        resetEstimateProduct: () =>
          set({ estimateProduct: [] }),
      }
    }),
    {
      name: 'estimateWrite',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      partialize: (state) => ({ estimateData: state.estimateData, estimateProductData: state.estimateProductData }),
    }
  )
);
export const useEstimateData = () => useEstimateStore((state) => state.estimateData);
export const useEstimateProductData = () => useEstimateStore((state) => state.estimateProductData);
export const useEstimateInfo = () => useEstimateStore((state) => state.estimateInfo);
export const useEstimateProduct = () => useEstimateStore((state) => state.estimateProduct);
export const useEstimateActions = () => useEstimateStore((state) => state.actions);

/* ----------------TAKEBACK STORE---------------- */
//반품 및 교환 STORE
export const useTakeBackStore = create((set) => ({
  filterOption: {
    raeOption: '',
    product_title: '',
    product_brand: '',
    product_id: '',
    raeDateType: 'r.rae_requestDate',
    date: {
      start: '',
      end: ''
    },
    raeState: ''
  },
  takeBackOption: [],
  actions: {
    setTakeBackFilterDate: (fieldName, value) =>
      set((state) => ({
        filterOption: {
          ...state.filterOption,
          date: {
            ...state.filterOption.date,
            [fieldName]: value,
          },
        },
      })),
    setTakeBackFilterOption: (fieldName, value) =>
      set((state) => ({ filterOption: { ...state.filterOption, [fieldName]: value } })),
    setTakeBackOption: (items) =>
      set((state) => ({
        takeBackOption: items.map((item) => ({
          ...item,
          returnStatus: '',
          barcodeStatus: '',
          wrapStatus: '',
          productStatus: '',
          rae_type: 0,
          name: '',
          rae_count: 0,
          rae_amount: '',
          reason: ''
        }))
      })),

    setTakeBackItemOption: (items, fieldName, value) =>
      set((state) => ({
        takeBackOption: state.takeBackOption.map((list) => {
          if (items === list.order_product_id) {
            return {
              ...list,
              [fieldName]: value,
            };
          }
          return list;
        }),
      })),
    resetFilterOption: () =>
      set({
        filterOption: {
          raeOption: '반품',
          product_title: '',
          product_brand: '',
          product_id: '',
          raeDateType: 'r.rae_requestDate',
          date: {
            start: '',
            end: ''
          },
          raeState: ''
        }
      }),
    resetTakeBackOption: () =>
      set({ takeBackOption: { returnStatus: "", barcodeStatus: "", wrapStatus: "", productStatus: "" } }),
  }
}));
export const useTakeBackFilter = () => useTakeBackStore((state) => state.filterOption);
export const useTakeBack = () => useTakeBackStore((state) => state.takeBackOption);
export const useTakeBackActions = () => useTakeBackStore((state) => state.actions);

/* ----------------=========== ADMIN ==========---------------- */


/* ----------------Product STORE---------------- */
export const useProductStore = create((set) => ({
  product: {
    product_id: '',
    product_spec: '',
    product_title: '',
    product_model: '',
    product_content: '',
    product_price: '',
    product_supply: 1,
    product_discount: 0,
    product_image_original: '',
    product_image_mini: '',
    option: {
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option6: '',
      option7: '',
      option8: '',
      option9: '',
    },
    category: {
      highId: '',
      middleId: '',
      lowId: '',
    },
    product_brand: '',
    product_madeIn: '',
    product_state: '',
  },
  actions: {
    setProduct: (fieldName, value) =>
      set((state) => ({ product: { ...state.product, [fieldName]: value } })),
    editProduct: (data) =>
      set((state) => ({ product: data })),
    editOptionProduct: (data) =>
      set((state) => ({
        product: {
          ...state.product,
          option: {
            ...state.product.option,
            option0: data.option0 && data.option0,
            option1: data.option1 && data.option1,
            option2: data.option2 && data.option2,
            option3: data.option3 && data.option3,
            option4: data.option4 && data.option4,
            option5: data.option5 && data.option5,
            option6: data.option6 && data.option6,
            option7: data.option7 && data.option7,
            option8: data.option8 && data.option8,
            option9: data.option9 && data.option9,
          },
        }
      })),
    resetProduct: () =>
      set({
        product: {
          product_id: '',
          product_spec: '',
          product_model: '',
          product_title: '',
          product_content: '',
          product_price: '',
          product_supply: 1,
          product_discount: 0,
          product_image_original: '',
          product_image_mini: '',
          option: {
            option0: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            option5: '',
            option6: '',
            option7: '',
            option8: '',
            option9: '',
          },
          category: {
            highId: '',
            middleId: '',
            lowId: '',
          },
          product_brand: '',
          product_madeIn: '',
          product_state: '',
        }
      }),
    setProductOption: (fieldName, value) =>
      set((state) => ({
        product: {
          ...state.product,
          option: {
            ...state.product.option,
            [fieldName]: value,
          },
        },
      })),
    resetProductOption: (fieldName, value) =>
      set((state) => ({
        product: {
          ...state.product,
          option: {
            option0: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
            option5: '',
            option6: '',
            option7: '',
            option8: '',
            option9: '',
          },
        },
      })),
    setProductCategory: (fieldName, value) =>
      set((state) => ({
        product: {
          ...state.product,
          category: {
            ...state.product.category,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useProduct = () => useProductStore((state) => state.product);
export const useProductActions = () => useProductStore((state) => state.actions);

/* ----------------ProductFilter STORE---------------- */
export const useProductFilterStore = create((set) => ({
  productFilter: {
    product_title: '',
    product_brand: '',
    product_id: '',
    state: [],
    category: {
      highId: '',
      middleId: '',
      lowId: ''
    },
    dateType: '',
    date: {
      start: '',
      end: ''
    },
    product_supply: '',
  },
  actions: {
    setProductFilter: (fieldName, value) =>
      set((state) => ({ productFilter: { ...state.productFilter, [fieldName]: value } })),
    resetProductFilter: () =>
      set({
        productFilter: {
          product_title: '',
          product_brand: '',
          product_id: '',
          state: [],
          category: {
            highId: '',
            middleId: '',
            lowId: ''
          },
          dateType: '',
          date: {
            start: '',
            end: ''
          },
          product_supply: '',
        }
      }),
    setProductCategory: (fieldName, value) =>
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          category: {
            ...state.productFilter.category,
            [fieldName]: value,
          },
        },
      })),
    setProductDate: (fieldName, value) =>
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          date: {
            ...state.productFilter.date,
            [fieldName]: value,
          },
        },
      })),
    setCheckboxState: (fieldName) =>
      set((state) => {
        // Check if fieldName is already present in the state
        const isFieldPresent = state.productFilter.state.find(item => item === fieldName);

        if (isFieldPresent) {
          // If fieldName is already present, filter it out
          return {
            ...state,
            productFilter: {
              ...state.productFilter,
              state: state.productFilter.state.filter(item => item !== fieldName)
            }
          };
        } else {
          // If fieldName is not present, add it to the state
          return {
            ...state,
            productFilter: {
              ...state.productFilter,
              state: [...state.productFilter.state, fieldName]
            }
          };
        }
      }
      ),
    setAllCheckboxState: (selectAll) =>
      set((state) => {
        // Check if selectAll is true
        if (selectAll === true) {
          // If selectAll is true, return a new state with all fields selected
          return {
            ...state,
            productFilter: {
              ...state.productFilter,
              state: [] // Select all fields
            }
          };
        } else if (selectAll === false) {
          // If selectAll is false, deselect all fields
          return {
            ...state,
            productFilter: {
              ...state.productFilter,
              state: ["판매대기", "판매중", "판매완료", "판매중단"] // Deselect all fields
            }
          };
        }
      })
  }
}));
export const useProductFilter = () => useProductFilterStore((state) => state.productFilter);
export const useProductFilterActions = () => useProductFilterStore((state) => state.actions);

/* ----------------OrderFilter STORE---------------- */
export const useOrderFilterStore = create((set) => ({
  orderFilter: {
    dateType: '',
    date: {
      start: '',
      end: ''
    },
    deliveryType: '',
    selectFilter: '',
    filterValue: '',
    orderState: '',
  },
  actions: {
    setOrderFilter: (fieldName, value) =>
      set((state) => ({ orderFilter: { ...state.orderFilter, [fieldName]: value } })),
    resetOrderFilter: () =>
      set({
        orderFilter: {
          dateType: '',
          date: {
            start: '',
            end: ''
          },
          deliveryType: '',
          selectFilter: '',
          filterValue: '',
          orderState: ''
        }
      }),
    setOrderDetailFilter: (fieldName, value) =>
      set((state) => ({
        orderFilter: {
          ...state.orderFilter,
          detailFilter: {
            ...state.orderFilter.detailFilter,
            [fieldName]: value,
          },
        },
      })),
    setOrderFilterDate: (fieldName, value) =>
      set((state) => ({
        orderFilter: {
          ...state.orderFilter,
          date: {
            ...state.orderFilter.date,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useOrderFilter = () => useOrderFilterStore((state) => state.orderFilter);
export const useOrderFilterActions = () => useOrderFilterStore((state) => state.actions);

/* ----------------OrderList STORE---------------- */
export const useOrderListStore = create((set) => ({
  selectList: [],
  actions: {
    toggleSelectList: (valueID, value) =>
      set((state) => ({
        selectList: state.selectList.some(item => item.order_id === valueID)
          ? state.selectList.filter(item => item.order_id !== valueID)
          : [...state.selectList, { order_id: valueID, value: value }],
      })),
    toggleAllSelect: (selectAll, value) =>
      set((state) => ({
        selectList: selectAll
          ? value.map((item) => ({
            order_id: item.order_id,
            value: item,
          }))
          : [], // 모두 선택 해제 시 빈 배열로 설정
      })),
    setSelectListValue: (item, fieldkey, value) =>
      set((state) => ({
        selectList: state.selectList.map((list) => {
          if (list.order_id === item.order_id) {
            return {
              ...list,
              value: {
                ...list.value,
                [fieldkey]: value,
              },
            };
          }
          return list;
        }),
      })),
    setAllSelectListValue: (fieldkey, value) =>
      set((state) => ({
        selectList: state.selectList.map((list) => {
          return {
            ...list,
            value: {
              ...list.value,
              [fieldkey]: value,
            },
          };
        })
      })),
    resetDeliveryNum: () =>
      set((state) => ({
        selectList: state.selectList.map((list) => ({
          ...list,
          deliveryNum: '',
        })),
      })),
    resetSelectList: () =>
      set({
        selectList: []
      })
  }
}));
export const useOrderSelectList = () => useOrderListStore((state) => state.selectList);
export const useOrderSelectListActions = () => useOrderListStore((state) => state.actions);

/* ----------------RefundFilter STORE---------------- */
export const useRefundFilterStore = create((set) => ({
  raeFilter: {
    raeState: '',
    date: {
      start: '',
      end: ''
    },
    rae_type: '',
    raeDateType: '',
    selectFilter: '',
    filterValue: ''
  },
  actions: {
    setRaeFilter: (fieldName, value) =>
      set((state) => ({ raeFilter: { ...state.raeFilter, [fieldName]: value } })),
    resetRaeFilter: () =>
      set({
        raeFilter: {
          raeState: '',
          date: {
            start: '',
            end: ''
          },
          rae_type: '',
          raeDateType: '',
          selectFilter: '',
          filterValue: ''
        }
      }),
    setRaeDetailFilter: (fieldName, value) =>
      set((state) => ({
        raeFilter: {
          ...state.raeFilter,
          detailFilter: {
            ...state.raeFilter.detailFilter,
            [fieldName]: value,
          },
        },
      })),
    setRaeFilterDate: (fieldName, value) =>
      set((state) => ({
        raeFilter: {
          ...state.raeFilter,
          date: {
            ...state.raeFilter.date,
            [fieldName]: value,
          },
        },
      })),
  }
}));
export const useRaeFilter = () => useRefundFilterStore((state) => state.raeFilter);
export const useRaeFilterActions = () => useRefundFilterStore((state) => state.actions);

/* ----------------Notice STORE---------------- */
export const useNoticeStore = create((set) => ({
  notice: {
    title: '',
    contents: '',
    date: '',
    files: null,
    writer: ''
  },
  actions: {
    addNoticeData: (value) =>
      set((state) => ({ notice: { ...value } })),
    setNoticeData: (fieldName, value) =>
      set((state) => ({ notice: { ...state.notice, [fieldName]: value } })),
    resetNoticeData: () =>
      set({
        notice: {
          title: '',
          contents: '',
          date: '',
          files: null,
          writer: ''
        },
      }),
  }
}));
export const useNotice = () => useNoticeStore((state) => state.notice);
export const useNoticeActions = () => useNoticeStore((state) => state.actions);


// ------------Delivery Filter------------

/**
 * * state
 *    * deliveryFilter{object}  - 배송 필터 상태를 관리하는 객체
 *      * [구성]
 *        * deliveryFilter.checkboxState {object}  - 배송 상태 체크박스 상태를 관리하는 객체
 *    * deliveryFilter.date{object}  - 배송일자 관련 정보를 담는 객체
 *      * [구성]
 *        * deliveryFilter.date.startDate {string} - 배송 시작일
 *        * deliveryFilter.date.endDate {string} - 배송 종료일
 * * actions
 *    * resetDeliveryFilter {function}  - 배송 필터 초기화 함수
 *    * updateCheckboxState {function}  - 체크박스 상태 업데이트 함수
 *    * allUpdateCheckboxState {function}  - 모든 체크박스 상태 업데이트 함수
 *    * setDateRange{ function}  - 배송일자 범위 지정 함수
 * 
 * @description 배송 필터 관리를 위한 Hook입니다.
 */
export const useDeliveryFilter = create((set) => ({
  deliveryFilter: {
    checkboxState: {
      // 0: false, 결제 대기
      // 1: false, 결제 완료
      2: false, // 배송 준비
      3: false, // 배송 중
      4: false, // 배송 완료
      // 5: false, // 취소
      // 6: false // 취소 요청
    },
    date: {
      start: '',
      end: '',
    },
  },

  resetDeliveryFilter: () => set({
    deliveryFilter: {
      checkboxState: {
        // 0: false, 결제 대기
        // 1: false, 결제 완료
        2: false, // 배송 준비
        3: false, // 배송 중
        4: false, // 배송 완료
        // 5: false, // 취소
        // 6: false // 취소 요청
      },
      date: {
        start: '',
        end: '',
      },
    }
  })
  ,

  updateCheckboxState: (fieldName) => set((state) => ({
    deliveryFilter: {
      ...state.deliveryFilter,
      checkboxState: {
        ...state.deliveryFilter.checkboxState,
        [fieldName]: !state.deliveryFilter.checkboxState[fieldName],
      }
    }
  })),

  allUpdateCheckboxState: (fieldName, bool) => set((state) => ({
    deliveryFilter: {
      ...state.deliveryFilter,
      checkboxState: {
        ...state.deliveryFilter.checkboxState,
        [fieldName]: bool,
      }
    }
  })),

  setDateRange: (start, end) => set((state) => ({
    deliveryFilter: {
      ...state.deliveryFilter,
      date: {
        ...state.deliveryFilter.date,
        start: start,
        end: end
      }
    }
  })),
}))


/* ----------------RefundFilter STORE---------------- */
export const useUserFilterStore = create((set) => ({
  userFilter: {
    cor_corName: '',
    cor_ceoName: '',
    cor_num: '',
    userType_id: -1,
    managerName: '',
  },
  userSort: {
    first: '',
    second: '',
    third: ''
  },
  actions: {
    setUserFilter: (fieldName, value) =>
      set((state) => ({ userFilter: { ...state.userFilter, [fieldName]: value } })),
    setUserSort: (fieldName, value) =>
      set((state) => ({ userSort: { ...state.userSort, [fieldName]: value } })),
    resetUserFilter: () =>
      set({
        userFilter: {
          cor_corName: '',
          cor_ceoName: '',
          cor_num: '',
          userType_id: '',
          name: '',
        }
      }),
    resetUserSort: () =>
      set({
        userSort: {
          first: '',
          second: '',
          third: ''
        }
      }),
  }
}));
export const useUserFilter = () => useUserFilterStore((state) => state.userFilter);
export const useUserSort = () => useUserFilterStore((state) => state.userSort);
/**
 * @Functions
 * - setUserFilter(fieldName, value) : 필터링할 내용을 담습니다.
 * - setUserSort(fieldName, value) : 정렬할 내용을 담습니다.
 * - resetUserFilter() : 유저 필터의 내용을 초기화합니다
 * @returns 
 */
export const useUserFilterActions = () => useUserFilterStore((state) => state.actions);

/* ----------------Event STORE---------------- */
export const useEventStore = create((set) => ({
  event: {
    event_title: '',
    event_content: '',
    event_startDate: '',
    event_endDate: '',
    event_image: '',
    eventState: '',
  },
  actions: {
    setEvent: (fieldName, value) =>
      set((state) => ({ event: { ...state.event, [fieldName]: value } })),
    editEvent: (data) =>
      set((state) => ({
        event: {
          event_id: data.event_id,
          event_title: data.event_title,
          event_content: data.event_content,
          event_startDate: new Date(data.event_startDate).toISOString().split('T')[0],
          event_endDate: new Date(data.event_endDate).toISOString().split('T')[0],
          event_image: data.event_image,
          eventState: data.eventState,
        }
      })),
    resetEvent: () =>
      set({
        event: {
          event_title: '',
          event_content: '',
          event_startDate: '',
          event_endDate: '',
          event_image: '',
          eventState: '',
        }
      })
  }
}));
export const useEvent = () => useEventStore((state) => state.event);
export const useEventActions = () => useEventStore((state) => state.actions);

/* ----------------EventFilter STORE---------------- */
export const useEventFilterStore = create((set) => ({
  eventFilter: {
    state: [],
    dateType: '',
    date: {
      start: '',
      end: ''
    },
  },
  actions: {
    setEventFilter: (fieldName, value) =>
      set((state) => ({ eventFilter: { ...state.eventFilter, [fieldName]: value } })),
    resetEventFilter: () =>
      set({
        eventFilter: {
          state: [],
          dateType: '',
          date: {
            start: '',
            end: ''
          },
        }
      }),
    setEventDate: (fieldName, value) =>
      set((state) => ({
        eventFilter: {
          ...state.eventFilter,
          date: {
            ...state.eventFilter.date,
            [fieldName]: value,
          },
        },
      })),
    setCheckboxState: (fieldName) =>
      set((state) => {
        // Check if fieldName is already present in the state
        const isFieldPresent = state.eventFilter.state.find(item => item === fieldName);

        if (isFieldPresent) {
          // If fieldName is already present, filter it out
          return {
            ...state,
            eventFilter: {
              ...state.eventFilter,
              state: state.eventFilter.state.filter(item => item !== fieldName)
            }
          };
        } else {
          // If fieldName is not present, add it to the state
          return {
            ...state,
            eventFilter: {
              ...state.eventFilter,
              state: [...state.eventFilter.state, fieldName]
            }
          };
        }
      }
      ),
    setAllCheckboxState: (selectAll) =>
      set((state) => {
        // Check if selectAll is true
        if (selectAll === true) {
          // If selectAll is true, return a new state with all fields selected
          return {
            ...state,
            eventFilter: {
              ...state.eventFilter,
              state: [] // Select all fields
            }
          };
        } else if (selectAll === false) {
          // If selectAll is false, deselect all fields
          return {
            ...state,
            eventFilter: {
              ...state.eventFilter,
              state: [1, 2, 3, 4] // Deselect all fields
            }
          };
        }
      })
  }
}));
export const useEventFilter = () => useEventFilterStore((state) => state.eventFilter);
export const useEventFilterActions = () => useEventFilterStore((state) => state.actions);

/* ----------------ADMIN SEARCH STORE---------------- */

export const useAdminSearchStore = create(
  persist(
    (set) => ({
      filterData: [],
      searchTerm: {
        searchFilter: "uc.cor_corName",
        search: ""
      },
      actions: {
        setFilterData: (val) =>
          set((prev) => ({
            filterData: val
          })),
        setSearchTerm: (fieldName, value) =>
          set((state) => ({ searchTerm: { ...state.searchTerm, [fieldName]: value } })),
        resetSearchTerm: () =>
          set({ searchTerm: { search: "" } }),
      }
    }),
    {
      name: 'adminSearchTerm',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      partialize: (state) => ({ searchTerm: state.searchTerm, filterData: state.filterData }),
    }
  )
);
export const useAdminSearchFilterData = () => useAdminSearchStore((state) => state.filterData);
export const useAdminSearchTerm = () => useAdminSearchStore((state) => state.searchTerm);
export const useAdminSearchActions = () => useAdminSearchStore((state) => state.actions);



/* ----------------Regex Store---------------- */
export const useRegex = create((set) => ({
  userIdRegex: /^.{8,19}$/, // 아이디가 8글자 이상 20글자 미만인지를 확인하는 정규 표현식,
  passwordRegex: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_`])[A-Za-z\d\W_`]{8,30}$/,
  emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 이메일 정규 표현식
  nameRegex: /^[a-zA-Z가-힣]{2,30}$/, // 이름 정규표현식 
  customRegex: /^[a-zA-Z가-힣\s()]{1,50}$/, // 기타Input 정규표현식

  actions: {
    /** 정규식 테스트 Function
    * @RegexList 정규식 후보 리스트
    * * userIdRegex : 아이디 - 8~19글자
    * * passwordRegex : 비밀번호 - 8~30글자, 영문자, 숫자, 특수문자 조합
    * * emailRegex : 이메일
    * * nameRegex : 이름 - 영문,한글 2글자 이상 30글자 미만
    * * customRegex // 기타 Input
     * @param {*} regex 
     * @param {*} testString 
     * @returns 
     */
    testRegex: (regex, testString) => {
      return regex.test(testString);
    }
  },
}))
export const useRegexItems = () => {
  const { userIdRegex, passwordRegex, emailRegex, nameRegex, customRegex } = useRegex();
  return { userIdRegex, passwordRegex, emailRegex, nameRegex, customRegex };
}
export const useRegexActions = () => useRegex((state) => state.actions);

/* ----------------Paging : 페이징 Store---------------- */
export const usePage = create((set) => ({
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 0,
  actions: {
    /**
     * 현재 페이지 번호를 저장/변경합니다.
     * @param {*} val 
     * @returns 
     */
    setCurrentPage: (val) => set((prev) => ({ currentPage: val })),
    /**
     * 현재 페이지에 포스팅할 개수를 저장/변경합니다.
     * @param {*} val 
     * @returns 
     */
    setItemsPerPage: (val) => set((prev) => ({ itemsPerPage: val })),
    /**
     * 페이지의 전체 개수를 담습니다.
     * @param {*} val 
     * @returns 
     */
    setTotalPages: (val) => set((prev) => ({ totalPages: val })),
  }
}));
/**
 * 페이징에 관련된 State를 담았습니다.
 * @returns {*} currentPage, itemsPerPage
 */
export const usePageState = () => {
  const { currentPage, itemsPerPage, totalPages } = usePage();
  return { currentPage, itemsPerPage, totalPages }
}
/**
 * 페이징에 관련된 Actions를 담았습니다.
 * @returns {*} setCurrentPage, setItemsPerPage
 */
export const usePageAction = () => {
  const { setItemsPerPage, setCurrentPage, setTotalPages } = usePage().actions
  return { setItemsPerPage, setCurrentPage, setTotalPages }
}


/* ----------------Paging : 페이징 Store---------------- */
const useCheckedUserStore = create(set => ({
  checkedUsers: [],

  actions: {
    // 입력받은 userId를 배열에 추가하는 액션
    addCheckedUser: (userId) => set(state => ({
      checkedUsers: [...state.checkedUsers, userId]
    })),
  }
}))
export const useCheckedUsersState = () => {
  const { checkedUsers } = useCheckedUserStore();
  return { checkedUsers }
}
export const useCheckedUsersActions = () => {
  const { addCheckedUser } = useCheckedUserStore.getState().actions;
  return { addCheckedUser }
}

/* ----------------manage queryKey Store---------------- */
export const useQueryKeyStore = create((set) => ({
  key: [],

  actions: {
    set
  }
}))