import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../clientAPI";

const initialState = {
    blogs: [],
    blog:null,
    status: null,
    loading: false,
    error: null,
}

export const getBlogs = createAsyncThunk('blog/getBlogs', async (_, thunkAPI) => {
    try {
        const { limit = 10, page = 1 } = _ || {};
        const response = await apiClient.get('/blog/', { params: { limit, page } });
        const data = response.data.data;
        console.log('Slice->>>>>>>>>>>>>', data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to fetch blogs' });
    }
})

export const getBlogById = createAsyncThunk('blog/getBlogById', async (id, thunkAPI) => {
    try {
        const response = await apiClient.get(`/blog/${id}`);
        console.log('Slice->>>>>>>>>>>>>', response.data.data);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to fetch blog' });
    }
})

export const addBlog = createAsyncThunk('blog/addBlog', async (blog, thunkAPI) => {
    try {
        const response = await apiClient.post('/blog/', blog);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to add blog' });
    }
})

export const addView = createAsyncThunk('blog/addView', async (payload, thunkAPI) => {
    try {
        console.log("its the time when control reached this thunk", payload.id);
        const response = await apiClient.put(`/blog/view/${payload.id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to add view' });
    }
})

export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id, thunkAPI) => {
    try {
        const response = await apiClient.delete(`/blog/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to delete blog' });
    }
})

export const updateBlog = createAsyncThunk('blog/updateBlog', async (blog, thunkAPI) => {
    try {
        const response = await apiClient.put(`/blog/${blog._id}`, blog);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data || { message: 'Failed to update blog' });
    }
})



const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getBlogs.pending, (state) => {
            state.loading = true;
            state.status = 'loading';

        })
        builder.addCase(getBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.error = null;
            state.blogs = Array.isArray(action.payload) ? action.payload : [];
        })
        builder.addCase(getBlogs.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to fetch blogs';
        })
        builder.addCase(addView.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.error = null;
            const updated = action.payload?.data || action.payload;
            if (Array.isArray(updated)) {
                state.blogs = updated;
            } else if (updated && updated._id) {
                state.blogs = state.blogs.map(blog => blog._id === updated._id ? updated : blog);
            } // else do not mutate blogs

        })
        builder.addCase(addView.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to add view';
        })
        builder.addCase(addView.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
        })
        builder.addCase(addBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.blogs.push(action.payload);
        })
        builder.addCase(addBlog.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to add blog';
        })
        builder.addCase(addBlog.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
        })
        builder.addCase(deleteBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.blogs = state.blogs.filter(blog => blog._id !== action.payload._id);
        })
        builder.addCase(deleteBlog.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to delete blog';
        })
        builder.addCase(deleteBlog.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
        })
        builder.addCase(updateBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.blogs = state.blogs.map(blog => blog._id === action.payload._id ? action.payload : blog);
        })
        builder.addCase(updateBlog.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to update blog';
        })
        builder.addCase(updateBlog.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
        })
        builder.addCase(getBlogById.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'success';
            state.blog= action.payload;
        })
        builder.addCase(getBlogById.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.payload?.message || 'Failed to fetch blog';
        })
        builder.addCase(getBlogById.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
        })

    }
})

export default blogSlice.reducer;
    

