import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../lib/Axois';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error:null
};
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {

     try {
       const response = await api.post('/auth/register', userData);
       return response.data;
     } catch (error) {
       return rejectWithValue(error.response.data);
     }
  }) 
export const ONBoarding = createAsyncThunk(
  'auth/onboarding',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/Onboarding', userData);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const UpdateProfile = createAsyncThunk(
  'user/UpdateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/UpdateProfile', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

  export const LoginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)
  export const Me = createAsyncThunk(
  'auth/me',
   async (_, { rejectWithValue }) => {
     try {
       const response = await api.get('/auth/me');

       return response.data;
     } catch (error) {
       return rejectWithValue(error.response.data);
    }
  }
)
export const LogoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const  AuthSlice=createSlice({
  name: 'auth',
  initialState,
reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },

     extraReducers: (builder) => {
          builder
          // Registration Users
               .addCase(register.pending, (state) => { 
                    state.loading = true;
                    state.error = null;
               })
               .addCase(register.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                    state.isAuthenticated = true;
               })
               .addCase(register.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
     //     Login User
               .addCase(LoginUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(LoginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.user = action.payload;
                    state.isAuthenticated = true;
               })
               .addCase(LoginUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
       // Logout User
               .addCase(LogoutUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(LogoutUser.fulfilled, (state) => {
                    state.loading = false;
                    state.user = null;
                    state.isAuthenticated = false;
               })
               .addCase(LogoutUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
       // OnBoarding
              .addCase(ONBoarding.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(ONBoarding.fulfilled, (state, action) => {
              state.loading = false;
              state.user = action.payload; 
            })
            .addCase(ONBoarding.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

      //me
       .addCase(Me.pending, (state) => {
              // state.loading = true;
              state.error = null;
            })
            .addCase(Me.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = true;
              state.user = action.payload.user;
              state.error = null;
            })
            .addCase(Me.rejected, (state, action) => {
              state.loading = false;
              state.isAuthenticated = false;
              state.user = null;
              state.error = action.payload?.message || 'Not authenticated';
            })
            //UpdateProfile
            .addCase(UpdateProfile.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(UpdateProfile.fulfilled, (state, action) => {
              state.loading = false;
              state.user = action.payload.UpdateUserProfile || action.payload.user || action.payload;
            })
            .addCase(UpdateProfile.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })     
             

     },
});


export const { clearError, setLoading } = AuthSlice.actions;
export default AuthSlice.reducer;