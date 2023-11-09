

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface authState {
    userid:string,
    name:string
}

export interface InitialState {
  value: authState;
}

const initialState: InitialState = {
  value: {
    name: "",
   userid:""
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
    logIn: (state, action: PayloadAction<Partial<authState>>) => {
      state.value = {
        ...state.value,
        ...action.payload,
      };
    },
  },
});

export const { logOut, logIn } = authSlice.actions;

export default authSlice.reducer;