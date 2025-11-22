import { useEffect, useRef } from "react";
import CloseIcon from "./CloseIcon";

const Modal = ({ isModalOpen, closeModal, children }) => {
  const dialogRef = useRef();

  useEffect(() => {
    isModalOpen ? dialogRef.current?.showModal() : dialogRef.current?.close();
  }, [isModalOpen]);

  const handleClick = (event) => {
    if (event.target === dialogRef.current) {
      closeModal();
    }
  };

  return (
    <dialog ref={dialogRef} onCancel={closeModal} onClick={handleClick}>
      {children}
    </dialog>
  );
};

export default Modal;
