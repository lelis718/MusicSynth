import { ReactNode, createContext, useContext, useEffect, useReducer } from "react";
import { AppState, SynthAction, reducer } from "./reducer";



const initialState:AppState = {
    audioContext: new AudioContext(),
    synthNodes: { },
    audioNodes: { }
}

const AppContext = createContext<{state:AppState, dispatch:React.Dispatch<SynthAction>}>({state:initialState, dispatch:()=>null})

type  StoreProps = {
    children: ReactNode
} 

const AppProvider = (props:StoreProps)=>{
    const [state, dispatch] = useReducer(reducer,initialState)
    return <AppContext.Provider value={{state, dispatch}}>{props.children}</AppContext.Provider>
}

const useFetching = (action:SynthAction)=>{
  const {dispatch} = useContext(AppContext);
  useEffect(()=>{
    dispatch(action)
  },[])
}

export { AppProvider, AppContext, useFetching}
