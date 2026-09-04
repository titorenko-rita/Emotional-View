import {createContext, FC, ReactNode, useContext, useEffect,useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

import {useGetCurrentUserQuery} from "@/app/redux/api/users.api";
import {userActions} from "@/app/redux/store/reducers";
import {useAppDispatch, useRoutes} from "@/hooks";
import {User} from "@/shared";

interface AuthContextProps {
    initializing: boolean
    authenticated: boolean
    unauthenticated: boolean
    login: ()=> void
    logout: ()=> void
    fetchUser: ()=> void
    setInitializing: ()=> void
}

const AuthContext = createContext<AuthContextProps>({
    initializing: true,
    authenticated: false,
    unauthenticated: false,
    logout: () => null,
    login: () => null,
    fetchUser: () => null,
    setInitializing: () => null,
})

const {Provider} = AuthContext

interface AuthContextProviderProps {
    children: ReactNode
}

enum AuthStatus {
    Initializing = "Initializing",
    Authenticated = "Authenticated",
    UnAuthenticated = "UnAuthenticated"
}

const AuthProvider: FC<AuthContextProviderProps> = ({children}) => {
    const [status, setStatus] = useState<AuthStatus>(AuthStatus.Initializing)

    const login = () => {
        setStatus(AuthStatus.Authenticated)
    }

    const logout = () => {
        setStatus(AuthStatus.UnAuthenticated)
    }

    const setInitializing = (): void => {
        setStatus(AuthStatus.Initializing)
    }

    const inStatus = (s: AuthStatus): boolean => {
        return status === s
    }

    const dispatch = useAppDispatch()

    const {addUser, deleteUser} = userActions
    const {refetch} = useGetCurrentUserQuery()


    const fetchUser = async ()=> {
        const {data, isError} = await refetch()

        if (!isError) {
            dispatch(addUser(data as unknown as User))
            login()
        } else {
            dispatch(deleteUser())
            logout()
        }
    }

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const {paths} = useRoutes()

    const auth = async ()=> {
        const code = searchParams.get('code')

        if (code) {
            navigate(paths.Monitoring)
        }
        await fetchUser()
    }

    useEffect(() => {
        setInitializing()
        auth()
    }, []);

    const value: AuthContextProps = {
        initializing: inStatus(AuthStatus.Initializing),
        authenticated: inStatus(AuthStatus.Authenticated),
        unauthenticated: inStatus(AuthStatus.UnAuthenticated),
        login,
        logout,
        fetchUser,
        setInitializing
    }

    return <Provider value={value}>{children}</Provider>
}

const useAuth = (): AuthContextProps => {
    return useContext(AuthContext)
}

export {AuthProvider, AuthContext, useAuth}
