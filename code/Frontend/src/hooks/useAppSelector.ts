import {TypedUseSelectorHook, useSelector} from "react-redux";

import {RootState} from "../app/redux";


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector