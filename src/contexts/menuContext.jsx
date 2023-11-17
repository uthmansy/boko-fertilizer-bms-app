import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export function useMenu() {
  return useContext(MenuContext);
}

export function MenuProvider({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const value = {
    isMenuOpen,
    setIsMenuOpen,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}
