import { createContext, useState } from "react";
// const UserContext = createContext({
//     isLogin : false,
//     setIsLogin : ()=>{}
// });
const UserContext = createContext({});
function UserProvider({children}) {
    const [isLogin, setIsLogin] = useState(false);
    const login = () => setIsLogin(true);
    const logout = () => setIsLogin(false);
    return <UserContext.Provider value={{isLogin, setIsLogin}}>{children}</UserContext.Provider>
}
export { UserProvider }
export default UserContext