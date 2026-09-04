import {useDispatch} from 'react-redux'

import {AppDispatch} from "../app/redux";


export const useAppDispatch = ()=> useDispatch<AppDispatch>()