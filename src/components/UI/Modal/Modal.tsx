import {
    FC,
    ForwardedRef,
    forwardRef,
    ReactNode,
    useEffect,
    useRef,
    useState,
} from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";
import Button from "../Button/Button";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    overlayRef: ForwardedRef<HTMLDivElement | null>;
    children: ReactNode;
    title?: string;
}

const Modal: FC<ModalProps> = ({
    open,
    onClose,
    overlayRef,
    children,
    title
}) => {

    if (!open) return null;
    else
        return ReactDOM.createPortal(
            <div
                ref={overlayRef}
                className={`${styles.modalOverlay} ${
                    open ? styles.modalOverlayOpen : ""
                }`}
                onClick={onClose}
                aria-modal="true"
                tabIndex={-1}
            >
                <dialog
                    style={{ width: 572 }}
                    className={styles.modalWindow}
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={0}
                >
                    <div className={styles.modalHeader}>
                        <div className={styles.modalHeaderContainer}>
                            <h3 className={styles.modalHeaderTitle}>{title}</h3>
                            <button onClick={onClose} className={styles.modalHeaderCloseBtn}>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 8 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.57808 3.99971L7.50776 0.507518C7.55687 0.449483 7.51558 0.361313 7.43968 0.361313H6.54906C6.4966 0.361313 6.44638 0.38475 6.41178 0.424929L3.99549 3.30551L1.57919 0.424929C1.54571 0.38475 1.49549 0.361313 1.44191 0.361313H0.551289C0.475396 0.361313 0.434102 0.449483 0.483209 0.507518L3.4129 3.99971L0.483209 7.49189C0.472208 7.50483 0.465151 7.52065 0.462875 7.53748C0.460598 7.55431 0.463198 7.57143 0.470367 7.58683C0.477535 7.60222 0.48897 7.61523 0.503314 7.62432C0.517658 7.63341 0.534309 7.63819 0.551289 7.6381H1.44191C1.49437 7.6381 1.54459 7.61466 1.57919 7.57448L3.99549 4.6939L6.41178 7.57448C6.44526 7.61466 6.49549 7.6381 6.54906 7.6381H7.43968C7.51558 7.6381 7.55687 7.54993 7.50776 7.49189L4.57808 3.99971Z"
                                        fill="var(--black-45)"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div
                        className={styles.modalContent}
                        style={{ height: 320 }}
                    >
                        {children}
                    </div>
                    <div className={styles.modalFooter}>
                        <div className={styles.modalFooterContainer}>
                            <Button onClick={onClose} innerStyle={{padding: "4px 16px "}}>Закрыть</Button>
                        </div>
                    </div>
                </dialog>
            </div>,
            document.body
        );
};
export default Modal;
