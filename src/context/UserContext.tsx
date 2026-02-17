import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserPreferences {
  location: string;
  interests: string[];
  budget: "budget" | "balanced" | "premium";
  tripStyle: "weekend" | "explorer" | "relaxed" | "backpacking";
  offbeat: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  isFirstLogin: boolean;
  preferences: UserPreferences;
  savedTrips: string[];
  wishlist: string[];
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  completeOnboarding: (prefs: UserPreferences) => void;
  toggleWishlist: (destId: string) => void;
  saveTrip: (destId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, name: string) => {
    setUser({
      id: "user_1",
      name,
      email,
      isFirstLogin: true,
      preferences: {
        location: "",
        interests: [],
        budget: "balanced",
        tripStyle: "explorer",
        offbeat: false,
      },
      savedTrips: [],
      wishlist: [],
    });
  };

  const logout = () => setUser(null);

  const completeOnboarding = (prefs: UserPreferences) => {
    setUser((prev) =>
      prev ? { ...prev, isFirstLogin: false, preferences: prefs } : null
    );
  };

  const toggleWishlist = (destId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const wishlist = prev.wishlist.includes(destId)
        ? prev.wishlist.filter((id) => id !== destId)
        : [...prev.wishlist, destId];
      return { ...prev, wishlist };
    });
  };

  const saveTrip = (destId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      if (prev.savedTrips.includes(destId)) return prev;
      return { ...prev, savedTrips: [...prev.savedTrips, destId] };
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarded: !!user && !user.isFirstLogin,
        login,
        logout,
        completeOnboarding,
        toggleWishlist,
        saveTrip,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be within UserProvider");
  return ctx;
};
