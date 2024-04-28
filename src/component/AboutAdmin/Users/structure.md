# 유저 관리 페이지 설계도
**필요한 모듈**
- Filtering
- Sorting
- Fetch
- Update
- Delete
- DoneUsers
- HoldUsers

## Tree
- Zustand
    - data
        - done: []
        - hold: []
    - type
        - done
        - hold
- Main(탭 구조: 고객 관리 | 가입대기 고객 -> 클릭할 때 type 결정)
    - Variables & Functions
        - CRUD fetch fn;
    - Components View
        - Sorting   
        - Filtering
        - DoneUser
        - HoldUser
- DetailInfo(모달)