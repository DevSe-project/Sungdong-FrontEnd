import { create } from 'zustand'

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

const useListStore = create((set) => ({
  wishList: [],
  orderList: [],
  cartList: [],
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

    resetCartList: (val) =>
      set((state) => ({
        orderList: []
      })),

    // 장바구니
    setCartList: (data) =>
      set((state) => ({
        cartList: [
          ...data.map((item) => ({...item})),
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
export const useCartList = () => useListStore((state) => state.cartList);
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
    order_name: '',
    order_tel: '',
    order_email: '',
    smtMessage: '',
    order_delName: '',
    order_delTel: '',
    address: [],
    addressDetail: '',
    order_payRoute: '',
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

export const useSearchStore = create((set) => ({
  seperateSearchTerm: {
    product_id: "",
    product_title: "",
    product_brand: "",
    product_spec: "",
    product_model: ""
  },
  actions: {
    setSeperateSearchTerm: (fieldName, value) =>
      set((state) => ({ seperateSearchTerm: { ...state.seperateSearchTerm, [fieldName]: value } })),
    resetSeperateSearchTerm: () =>
      set({ seperateSearchTerm: { product_id: "", product_title: "", product_brand: "", product_spec: "", product_model: "" } }),
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
    productStatus: "",
    name: "",
    reason: "",
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

/* ----------------ERRORTRADE STORE---------------- */
export const useErrTradeStore = create((set) => ({
  errTradeOption: {
    returnStatus: "",
    barcodeStatus: "",
    wrapStatus: "",
    productStatus: "",
    name: "",
    reason: "",
  },
  actions: {
    setErrTradeOption: (fieldName, value) =>
      set((state) => ({ errTradeOption: { ...state.errTradeOption, [fieldName]: value } })),
    resetErrTradeOption: () =>
      set({ errTradeOption: { returnStatus: "", barcodeStatus: "", wrapStatus: "", productStatus: "" } }),
  }
}));
export const useErrTrade = () => useErrTradeStore((state) => state.errTradeOption);
export const useErrTradeActions = () => useErrTradeStore((state) => state.actions);


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
    title: '',
    brand: '',
    productId: '',
    state: {
      전체: false,
      판매대기: false,
      판매중: false,
      판매중단: false,
      판매종료: false
    },
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
    supply: '',
    option: '',
  },
  actions: {
    setProductFilter: (fieldName, value) =>
      set((state) => ({ productFilter: { ...state.productFilter, [fieldName]: value } })),
    resetProductFilter: () =>
      set({
        productFilter: {
          title: '',
          brand: '',
          productId: '',
          state: {
            전체: false,
            판매대기: false,
            판매중: false,
            판매중단: false,
            판매종료: false
          },
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
          supply: '',
          option: '',
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
      set((state) => ({
        productFilter: {
          ...state.productFilter,
          state: {
            ...state.productFilter.state,
            [fieldName]: !state[fieldName],
          },
        },
      })),
    setAllCheckboxState: () =>
      set((state) => {
        const allChecked = Object.values(state.productFilter.state).every((value) => value);
        const updatedState = {};

        Object.keys(state.productFilter.state).forEach((key) => {
          updatedState[key] = !allChecked;
        });

        return {
          ...state,
          productFilter: {
            ...state.productFilter,
            state: updatedState,
          },
        };
      }),
  }
}));
export const useProductFilter = () => useProductFilterStore((state) => state.productFilter);
export const useProductFilterActions = () => useProductFilterStore((state) => state.actions);

/* ----------------OrderFilter STORE---------------- */
export const useOrderFilterStore = create((set) => ({
  orderFilter: {
    orderState: '',
    dateType: '',
    date: {
      start: '',
      end: ''
    },
    deliveryType: '',
    deliveryNum: '',
    detailFilter: {
      userId: '',
      orderId: '',
      productId: '',
      deliveryNum: '',
      companyName: '',
      name: '',
      tel: '',
    }
  },
  actions: {
    setOrderFilter: (fieldName, value) =>
      set((state) => ({ orderFilter: { ...state.orderFilter, [fieldName]: value } })),
    resetOrderFilter: () =>
      set({
        orderFilter: {
          orderState: '',
          dateType: '',
          date: {
            start: '',
            end: ''
          },
          deliveryType: '',
          detailFilter: {
            userId: '',
            orderId: '',
            productId: '',
            deliveryNum: '',
            companyName: '',
            name: '',
            tel: '',
          }
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
        selectList: state.selectList.some(item => item.orderId === valueID)
          ? state.selectList.filter(item => item.orderId !== valueID)
          : [...state.selectList, { orderId: valueID, value: value }],
      })),
    toggleAllSelect: (selectAll, value) =>
      set((state) => ({
        selectList: selectAll
          ? value.map((item) => ({
            orderId: item.orderId,
            value: item,
          }))
          : [], // 모두 선택 해제 시 빈 배열로 설정
      })),
    setSelectListValue: (item, fieldkey, value) =>
      set((state) => ({
        selectList: state.selectList.map((list) => {
          if (list.orderId === item.orderId) {
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
    raeDateType: '',
    detailFilter: {
      userId: '',
      orderId: '',
      productId: '',
      deliveryNum: '',
      companyName: '',
      name: '',
      tel: '',
    }
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
          raeDateType: '',
          detailFilter: {
            userId: '',
            orderId: '',
            productId: '',
            deliveryNum: '',
            companyName: '',
            name: '',
            tel: '',
          }
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
export const useDeliveryFilter = create((set) => ({
  // 배송상태
  checkboxState: {
    '배송 준비': false,
    '배송 중': false,
    '배송 완료': false,
    '배송 지연': false
  },
  // 배송일자'
  date: {
    startDate: '',
    endDate: '',
    filteredData: []
  },

  // 초기화
  resetDeliveryFilter: () => set({
    checkedState: {
      '배송 준비': false,
      '배송 중': false,
      '배송 완료': false,
      '배송 지연': false,
    },
    date: {
      startDate: '',
      endDate: '',
      filteredData: []
    },
  }),

  // 업데이트 : 체크박스 핸들러
  updateCheckboxState: (fieldName) => set((state) => ({
    checkboxState: {
      ...state.checkboxState,
      [fieldName]: !state.checkboxState[fieldName],
    },
  })),

  // 전체 업데이트
  allUpdateCheckboxState: (fieldName, bool) => set((state) => ({
    checkboxState: {
      ...state.checkboxState,
      [fieldName]: bool,
    },
  })),

  // 배송일자 범위 지정
  setDateRange: (start, end) => set((state) => ({
    date: {
      ...state.date,
      startDate: start,
      endDate: end
    }
  })),

  //
  filterDate: (data) => {
    // 데이터 필터링, 상태 업데이트 로직을 추가 예정
    const filteredData = data.filter((item) => {
      // 필터링 조건에 따라 로직을 구현 예정
      // item.date가 startDate와 endDate 사이에 있는지 확인하는 등등...ㅅㅂ

      return true; // 나중에 결과 반환
    });

    set({ filteredData });
  },
}))

/* ----------------RefundFilter STORE---------------- */
export const useUserFilterStore = create((set) => ({
  userFilter: {
    cor_corName: '',
    cor_ceoName: '',
    cor_num: '',
    userType_id: '',
    grade: '',
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
          grade: '',
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
export const useUserFilterActions = () => useUserFilterStore((state) => state.actions);
