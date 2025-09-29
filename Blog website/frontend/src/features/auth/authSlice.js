import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../clientAPI";
const initialState = {
    user: null,
    token:null,
    loading: false,
    error: null
}

export const signup=createAsyncThunk("auth/signup",async(user)=>{
    try {
        const response=await apiClient.post("/user/signup",user);
        console.log('this is thunk log',response.data.data);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
})

export const login=createAsyncThunk(
    "auth/login",
    async (user, thunkAPI)=>{
        try {
            console.log(" this is the thunk and the user here:",user)
            const response=await apiClient.post("/user/login",user);
            console.log('this is  Login thunk log',response.data.data.user);
            return response.data.data;
        } catch (error) {
            const payload = error?.response?.data || { message: 'Login failed' };
            return thunkAPI.rejectWithValue(payload);
        }
    }
)
export const profile=createAsyncThunk('auth/Profile',async(id)=>{
    try {
        const response=await apiClient.get(`/user/profile?id=${id}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
})
export const googleSignup=createAsyncThunk('auth/googleSignup',async(user)=>{
    try {
        const response=await apiClient.post("/user/google",user);
        console.log('this is gooogle signup thunk log',response.data.data.user);
        return response.data.data;
    } catch (error) {
        return error.response.data.data;
    }
})

export const logout=createAsyncThunk('auth/logout',async()=>{
    try {
        const response=await apiClient.post("/user/logout");
        console.log('this is thunk log',response.data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
})

const authSlice = createSlice({
    name: 'auth',          
    initialState: initialState,  
    reducers: {
        // Hydrate auth state from persisted storage (e.g., localStorage)
        hydrateAuth: (state, action) => {
            const { user = null, token = null } = action.payload || {};
            state.user = user;
            state.token = token;
        }
    },
    extraReducers: (builder) => {
        //signup
        builder.addCase(signup.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(signup.fulfilled,(state,action)=>{
            state.loading=false;
            // signup thunk returns response.data.data => { token, user }
            state.user=action.payload.user;
            state.token=action.payload.token;
        })
        builder.addCase(signup.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        //login
        builder.addCase(login.pending,(state)=>{
            state.loading=true;
        })
        builder .addCase(login.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload.user;
            state.token=action.payload.token;
        })
        builder.addCase(login.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

        //profile
        builder.addCase(profile.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(profile.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload.user;
        })
        builder.addCase(profile.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        //googleSignup
        builder.addCase(googleSignup.pending,(state)=>{
            state.loading=true;
        })
        builder.addCase(googleSignup.fulfilled,(state,action)=>{
            state.loading=false;
            state.user=action.payload.user;
            state.token=action.payload.token;
        })
        builder.addCase(googleSignup.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
       //logout
       builder.addCase(logout.pending,(state)=>{
           state.loading=true;
       })
       builder.addCase(logout.fulfilled,(state)=>{
           state.loading=false;
           state.user=null;
           state.token=null;
       })
       builder.addCase(logout.rejected,(state,action)=>{
           state.loading=false;
           state.error=action.payload;
       })
       
    }
  });

  export const { hydrateAuth } = authSlice.actions;
  export default authSlice.reducer;
                
            