import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null, // 'admin' | 'student'
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.role = action.payload.role
    },
    clearUser: (state) => {
      state.user = null
      state.role = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer
