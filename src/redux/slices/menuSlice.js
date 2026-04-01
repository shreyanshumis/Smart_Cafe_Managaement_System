import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    items: [],
    isLoading: false,
    isError: false,
    message: ''
};

// ✅ Get menu items
export const getMenuItems = createAsyncThunk(
    'menu/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/menu');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ✅ Create menu item (WITH IMAGE SUPPORT)
export const createMenuItem = createAsyncThunk(
    'menu/create',
    async (menuData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // 🔥 IMPORTANT
                }
            };

            const response = await axios.post('/api/menu', menuData, config);
            return response.data;

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// (Optional but recommended) Delete menu item
export const deleteMenuItem = createAsyncThunk(
    'menu/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.delete(`/api/menu/${id}`, config);
            return { id, message: response.data.message };

        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET MENU
            .addCase(getMenuItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMenuItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(getMenuItems.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // CREATE MENU ITEM
            .addCase(createMenuItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createMenuItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items.push(action.payload);
            })
            .addCase(createMenuItem.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // DELETE MENU ITEM
            .addCase(deleteMenuItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload.id);
            });
    }
});

export default menuSlice.reducer;