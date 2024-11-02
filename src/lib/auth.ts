import { LoginRes } from '@components/login-form/useLogin';
import { User } from '@lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface IAuthState {
  user?: User;
  token?: string;
  isAuthenticated: boolean;
}

export interface IAuthAction {
  login: (user: LoginRes['data']) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
}

export const useAuth = create(
  persist<IAuthState & IAuthAction>(
    (set, get) => ({
      user: undefined,
      isAuthenticated: false,
      token: undefined,
      login: ({ user, access_token }: LoginRes['data']) => {
        set({ user, isAuthenticated: true, token: access_token });
      },
      logout: () => {
        set({ user: undefined, isAuthenticated: false, token: undefined });
      },
      setUser: (user) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            ...user,
          },
        });
      },
    }),
    {
      name: 'user-s',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useStateLogin = () => {
  const { login } = useAuth();
  return login;
};

export const useUpdateUser = () => {
  const { setUser } = useAuth();
  return setUser;
};
