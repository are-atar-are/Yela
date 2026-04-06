import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import {
  signIn,
  completeNewPassword,
  checkAuthStatus,
  logout,
  setRememberedUsername,
  clearError,
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuthStatus() as any);
  }, [dispatch]);

  const login = useCallback(
    async (username: string, password: string) => {
      return dispatch(signIn({ username, password }) as any);
    },
    [dispatch]
  );

  const setNewPassword = useCallback(
    async (username: string, newPassword: string) => {
      return dispatch(completeNewPassword({ username, newPassword }) as any);
    },
    [dispatch]
  );

  const signOut = useCallback(() => {
    dispatch(logout() as any);
  }, [dispatch]);

  const rememberUsername = useCallback(
    (username: string | null) => {
      dispatch(setRememberedUsername(username));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    error: auth.error,
    rememberedUsername: auth.rememberedUsername,

    // Actions
    login,
    setNewPassword,
    signOut,
    rememberUsername,
    clearAuthError,
  };
};

export default useAuth;
