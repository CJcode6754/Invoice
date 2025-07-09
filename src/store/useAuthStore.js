import { persist } from "zustand/middleware";
import { create } from "zustand";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,

      register: async (userData) => {
        const { users } = get();
        const existingUser = users.find((u) => u.email === userData.email);

        if (existingUser) {
          toast.error("User already exist");
          return false;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = {
          id: Date.now.toString(),
          ...userData,
          password: hashedPassword,
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

      login: async (email, password) => {
        const { users } = get();

        const user = users.find((u) => u.email === email);
        if (!user) {
          toast.error("Invalid credentials");
          return false;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
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
