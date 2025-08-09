import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from '../lib/Axois'
const initialState={
     lodading:false,
     message:[],
     error:null,
}
export const GetMessages=createAsyncThunk('/getmessage',async(receiverId,{rejectWithValue})=>{

try {
     const response=await api.get(`/chat/${receiverId}`)
     return response.data;
    
} catch (error) {
    console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data || "Error fetching friends");   
}

})
export const SendMessages = createAsyncThunk(
  '/sendmessage',
  async ({ receiverId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/send/${receiverId}`, data);
      return response.data;
    } catch (error) {
      console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data || "Error sending message");
    }
  }
 );
export const DeleteMessage=createAsyncThunk('/deletemessage',async(MessageId,{rejectWithValue})=>{
  try {
    const response=await api.delete(`/chat/${MessageId}`)
    return response.data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || "Error deleting message");
  }
 })
// Update existing message text
export const UpdateMessage = createAsyncThunk(
  '/updatemessage',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/chat/${id}`, { text });
      return response.data; // { success: true, updated: { _id, text } }
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Error updating message');
    }
  }
)
export const MessageSlice = createSlice({
     name: 'Message',
     initialState,
     reducers: {
       clearError: (state) => {
         state.error = null;
       },
       setLoading: (state, action) => {
         state.lodading = action.payload;
       },
     },
     extraReducers: (builder) => {
       builder
         .addCase(GetMessages.pending, (state) => {
           state.lodading = true;
           state.message = [];
           state.error = null;
         })
         .addCase(GetMessages.fulfilled, (state, action) => {
           state.lodading = false;
           state.message = action.payload;
           state.error = null;
         })
         .addCase(GetMessages.rejected, (state, action) => {
           state.lodading = false;
           state.message = [];
           state.error = action.payload;
         })
         .addCase(SendMessages.pending, (state) => {
          state.lodading = true;
          state.error = null;
        })
        .addCase(SendMessages.fulfilled, (state, action) => {
          state.lodading = false;
          state.message = action.payload;
          state.error = null;
        })
        .addCase(SendMessages.rejected, (state, action) => {
          state.lodading = false;
          state.message = [];
          state.error = action.payload;
        })
        // Handle delete message lifecycle
        .addCase(DeleteMessage.pending, (state) => {
          state.lodading = true;
          state.error = null;
        })
        .addCase(DeleteMessage.fulfilled, (state, action) => {
          state.lodading = false;
          const deletedId = action.payload?.deletedId || action.meta.arg;
          if (Array.isArray(state.message?.FindMyMessage)) {
            state.message.FindMyMessage = state.message.FindMyMessage.filter(
              (m) => m._id !== deletedId
            );
          }
        })
        .addCase(DeleteMessage.rejected, (state, action) => {
          state.lodading = false;
          state.error = action.payload;
        })
        // Handle update message lifecycle
        .addCase(UpdateMessage.pending, (state) => {
          state.lodading = true;
          state.error = null;
        })
        .addCase(UpdateMessage.fulfilled, (state, action) => {
          state.lodading = false;
          const updated = action.payload?.updated;
          if (updated && Array.isArray(state.message?.FindMyMessage)) {
            state.message.FindMyMessage = state.message.FindMyMessage.map((m) =>
              m._id === updated._id ? { ...m, text: updated.text } : m
            );
          }
        })
        .addCase(UpdateMessage.rejected, (state, action) => {
          state.lodading = false;
          state.error = action.payload;
        })
     }})
     
   
export const { clearError, setLoading } = MessageSlice.actions;
export default MessageSlice.reducer;