import { createContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface ModalContextProvider{
    children: React.ReactNode;
}

const defaultModalState: ModalContextType = {
  isOpen: false,
  onClose: () => {},
  onOpen: () => {},
};

const ModalContext = createContext(defaultModalState);

export const ModalContextProvider = ({ children }:ModalContextProvider) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <ModalContext.Provider value={{ isOpen, onClose, onOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;