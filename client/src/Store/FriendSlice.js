import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../lib/Axois';

const initialState = {
  recommendedUsers: [],
  myFriend:[],
  GoingRequest:[],
  IncomeRequest:[],
  isLoading: false,
  error: null,
  selectedFriendId: null,
};

export const getRecommandedFriend = createAsyncThunk(
  'friends/getFriend',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/recommended-users');
      return response.data;

    } catch (error) {

      return rejectWithValue(error?.response?.data || "Error fetching friends");
    }
  }
);
export const SendRequest = createAsyncThunk(
  'friend/sendrequest',
  async (FriendId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/friends-request/${FriendId}`);
      return response.data;
    } catch (error) {

      return rejectWithValue(error?.response?.data || "Error SendRequest friends");
    }
  }
);

export const MyFriends=createAsyncThunk('/user/friends-list',async(_,{rejectWithValue})=>{
  try {
    const response= await api.get('/user/friends-list')
    return response.data;

  } catch (error) {
       
      return rejectWithValue(error?.response?.data || "Error fetching friends");
  }
})
export const GetOutGoingRequest=createAsyncThunk('/user/getOutgoingReq',async(_,{rejectWithValue})=>{
  try {
    const response =await api.get('/user/getOutgoingReq')

    // The backend returns { success: true, ReqOutGo }
    return response.data.ReqOutGo || response.data;
  } catch (error) {
    
      return rejectWithValue(error?.response?.data || "Error in getOutGoingRequest");
  }
})
export const IncomeFriendsRequest=createAsyncThunk('/user/friends-request',async(_,{rejectWithValue})=>{
  try {
    const response =await api.get('/user/friends-request')
 
    // The backend returns { success: true, data: { IncomeRequest, acceptedReq } }
    return response.data.data?.IncomeRequest || response.data.IncomeRequest || [];
  } catch (error) {
 
      return rejectWithValue(error?.response?.data || "Error in getRecommandedFriend friends");
  }
})

 export const RequestAccept = createAsyncThunk(
  'friends/requestAccept',
  async (requestId, { rejectWithValue }) => {
    try {
   
      const response = await api.put(`/user/friends-request/${requestId}/accept`);

      return response.data;
    } catch (error) {
  
      return rejectWithValue(error?.response?.data || "Error accepting friend request");
    }
  }
);
export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setSelectedFriendId: (state, action) => {
      state.selectedFriendId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecommandedFriend.pending, (state) => {
        state.isLoading = true;
        state.recommendedUsers = [];
        state.error = null;
      })
      .addCase(getRecommandedFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedUsers = action.payload;
        state.error = null;
      })
      .addCase(getRecommandedFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.recommendedUsers = [];
        state.error = action.payload;
      })
      .addCase(MyFriends.pending, (state) => {
        state.isLoading = true;
        state.myFriend = [];
        state.error = null;
      })
      .addCase(MyFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myFriend = action.payload;
        state.error = null;
      })
      .addCase(MyFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.myFriend = [];
        state.error = action.payload;
      })
      // GetOutGoingRequest
      
      .addCase(GetOutGoingRequest.pending, (state) => {
        state.isLoading = true;
        // state.GoingRequest = [];
        state.error = null;
      })
      .addCase(GetOutGoingRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.GoingRequest = action.payload;
        state.error = null;
      })
      .addCase(GetOutGoingRequest.rejected, (state, action) => {
        state.isLoading = false;
        // state.GoingRequest = [];
        state.error = action.payload;
      })
      .addCase(IncomeFriendsRequest.pending, (state) => {
        state.isLoading = true;
        state.IncomeRequest = [];
        state.error = null;
      })
      .addCase(IncomeFriendsRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.IncomeRequest = action.payload;
        state.error = null;
      })
      .addCase(IncomeFriendsRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.IncomeRequest = [];
        state.error = action.payload;
      })

      // RequestAccept
      .addCase(RequestAccept.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RequestAccept.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Remove the accepted request from IncomeRequest
        if (action.payload?.success) {
          state.IncomeRequest = state.IncomeRequest.filter(
            request => request._id !== action.payload.data?._id
          );
        }
      })
      .addCase(RequestAccept.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading } = friendSlice.actions;
export default friendSlice.reducer;