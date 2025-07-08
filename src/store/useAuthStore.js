import { persist } from "zustand/middleware";
import create from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,

      register: (userData) => {
        const { users } = get();
        const existingUser = users.find((u) => u.email === userData.email);

        if (existingUser) {
          toast.error("User already exist");
          return false;
        }

        const newUser = {
          id: Date.now.toString(),
          ...userData,
          createdAt: new Date().toISOString(),
        };

        set({
          users: [...users, newUser],
          user: newUser,
          isAuthenticated: true,
        });

        toast.success("Successfully register new user");
        return true;
      },

      login: (email, password) => {
        const { users } = get();

        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          set({ user, isAuthenticated: true });
          toast.success("Login Successfully");
          return true;
        }

        toast.error("Invalid credentials");
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success("Logout Successfully");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
