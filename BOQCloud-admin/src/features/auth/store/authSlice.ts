import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, User, AuthTokens } from '../types/auth.types';
import { cognitoService } from '../services/cognitoService';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  rememberedUsername: localStorage.getItem('rememberedUsername') || null,
};

// Async thunks
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await cognitoService.signIn(username, password);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeNewPassword = createAsyncThunk(
  'auth/completeNewPassword',
  async ({ username, newPassword }: { username: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const result = await cognitoService.completeNewPassword(username, newPassword);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const user = await cognitoService.getCurrentUser();
      const tokens = await cognitoService.getCurrentSession();
      return { user, tokens };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await cognitoService.signOut();
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRememberedUsername: (state, action) => {
      state.rememberedUsername = action.payload;
      if (action.payload) {
        localStorage.setItem('rememberedUsername', action.payload);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Complete New Password
    builder.addCase(completeNewPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(completeNewPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(completeNewPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Check Auth Status
    builder.addCase(checkAuthStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.user && action.payload.tokens) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      }
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
  },
});

export const { clearError, setRememberedUsername, clearAuth } = authSlice.actions;
export default authSlice.reducer;
