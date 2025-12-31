import { createContext, useContext } from 'react';

interface DiscoverContextType {
  isOpen: boolean;
  openDiscover: () => void;
  closeDiscover: () => void;
}

// Default values to avoid null checks, though provider should always be present
export const DiscoverContext = createContext<DiscoverContextType>({
  isOpen: false,
  openDiscover: () => {},
  closeDiscover: () => {},
});

export const useDiscover = () => useContext(DiscoverContext);