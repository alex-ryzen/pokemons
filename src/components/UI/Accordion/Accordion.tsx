import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import BlockTitle from "../BlockTitle/BlockTitle";
import styles from "./accordion.module.css";

interface AccordionProps {
    isOpen: boolean;
    title: string;
    onClick: () => void;
    children: React.ReactNode;
    sectionsCount: number;
    containerRef: RefObject<HTMLDivElement | null>;
}

function Accordion({ isOpen, title, onClick, children, sectionsCount, containerRef }: AccordionProps) {
    const headerWrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    useEffect(() => {
        setHeaderHeight(headerWrapperRef.current?.clientHeight ?? 0);
    }, [containerRef, headerWrapperRef]);

    return (
        <div
            className={`${styles.accordion} content-block ${isOpen ? styles["accordion--open"] : ""}`}
        >
            <div className={styles.accordionInnerWrapper}>
                <div
                    ref={headerWrapperRef}
                    className={styles["accordion-header-wrapper"]}
                    onClick={onClick}
                    role="button"
                    tabIndex={0}
                >
                    <div className={styles["accordion-header-container"]}>
                        <BlockTitle extClassName={styles["accordion-header"]}>
                            {title}
                        </BlockTitle>
                        <svg
                            className={styles["accordion-arrow-icon"]}
                            width="18"
                            height="11"
                            viewBox="0 0 18 11"
                            fill="none"
                        >
                            <path
                                d="M8.99996 10.9745L17.2378 2.73784L14.7621 0.262168L8.99996 6.0255L3.23779 0.262169L0.762124 2.73784L8.99996 10.9745Z"
                                fill="var(--secondary-color)"
                            />
                        </svg>
                    </div>
                </div>

                <div className={styles["accordion-content-wrapper"]}
                style={{height: isOpen ? `calc(100% - ${headerHeight}px)` : 0}}>
                    <div
                        ref={contentRef}
                        className={styles["accordion-content"]}
                        aria-hidden={!isOpen}
                    >
                        <CSSTransition
                            in={isOpen}
                            timeout={300}
                            nodeRef={contentRef}
                            mountOnEnter
                            unmountOnExit
                            classNames={{
                                enter: styles.accEnter,
                                enterActive: styles.accEnterActive,
                                exit: styles.accExit,
                                exitActive: styles.accExitActive,
                            }}
                        >
                            <div className={styles["accordion-inner"]}>
                                <div className={styles["accordion-inner-container"]}>
                                    {children}
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Accordion;

// import { RefObject, useEffect, useRef, useState } from "react";
// import BlockTitle from "../BlockTitle/BlockTitle";
// import styles from './accordion.module.css'
// import { ACCORDIONS_GAP } from "../../../consts";

// interface AccordionProps {
//   isOpen: boolean;
//   title: string;
//   onClick: () => void;
//   children: React.ReactNode;
//   sectionsCount: number;
//   containerRef: RefObject<HTMLDivElement | null>
// }

// function Accordion({ isOpen, title, onClick, children, sectionsCount, containerRef }: AccordionProps) {
//     const headerWrapperRef = useRef<HTMLDivElement>(null);
//     const [maxHeight, setMaxHeight] = useState<number>(0)
//     useEffect(() => {
//        console.log(maxHeight)
//     }, [maxHeight])
//     useEffect(() => {
//         setMaxHeight(() => {
//             const containerH = containerRef.current?.clientHeight ?? 300;
//             const headerH = headerWrapperRef.current?.clientHeight ?? 0;
//             const closedSectionsHeight = sectionsCount * (headerH + ACCORDIONS_GAP) - ACCORDIONS_GAP;
//             const h = containerH - closedSectionsHeight;
//             return h > 0 ? h : 0;
//         })
//     }, [])
//     return (
//         <div
//             className={`${styles.accordion} content-block ${
//                 isOpen ? styles["accordion--open"] : ""
//             }`}
//         >
//             <div className={styles.accordionInnerWrapper}>
//                 <div ref={headerWrapperRef} className={styles["accordion-header-wrapper"]} onClick={onClick}>
//                     <div className={styles["accordion-header-container"]}>
//                         <BlockTitle
//                             extClassName={styles["accordion-header"]}
//                         >
//                             {title}
//                         </BlockTitle>
//                         <svg
//                             className={styles['accordion-arrow-icon']}
//                             width="18"
//                             height="11"
//                             viewBox="0 0 18 11"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                         >
//                             <path
//                                 d="M8.99996 10.9745L17.2378 2.73784L14.7621 0.262168L8.99996 6.0255L3.23779 0.262169L0.762124 2.73784L8.99996 10.9745Z"
//                                 fill="var(--secondary-color)"
//                             />
//                         </svg>
//                     </div>
//                 </div>
//                 {isOpen && (
//                     <div className={`${styles["accordion-content-wrapper"]} ${isOpen ? styles["content--open"] : ""}`}>
//                         <div
//                             className={styles["accordion-content"]}
//                             aria-hidden={!isOpen}
//                             style={{ maxHeight }}
//                             //style={ isOpen ? {maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${GENERAL_PADDING}px * 2 - ${GENERAL_GAP}px - ${sectionsCount} * ${ACCORDION_HEIGHT}px - ${sectionsCount - 1} * ${ACCORDIONS_GAP}px)`} : {}} //100vh - header - generalPadding(top and bot) - generalGap - sectionCount * accordionHeight - (sectionCount-1 (it is accordionsGapCount)) * accordionsGap - contentMarginTop 
//                         >
//                             <div className={styles["accordion-inner"]}>{children}</div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Accordion;


{/* <CSSTransition
    in={isOpen}
    timeout={HEIGHT_ANIMATION_MS}
    nodeRef={contentRef}
    mountOnEnter
    unmountOnExit
    classNames={classNames}
    onEnter={() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.maxHeight = "0px";
        el.style.overflow = "hidden";
    }}
    onEntering={() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.maxHeight = `${maxHeight}px`;
    }}
    onEntered={() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.overflow = "auto";
    }}
    onExit={() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.overflow = "hidden";
        el.style.maxHeight = `${maxHeight}px`;
    }}
    onExiting={() => {
        const el = contentRef.current;
        if (!el) return;
        el.style.maxHeight = "0px";
    }}
>
    <div className={styles["accordion-content-wrapper"]}>
        <div ref={contentRef} className={styles["accordion-content"]} aria-hidden={!isOpen}>
            <div className={styles["accordion-inner"]}>{children}</div>
        </div>
    </div>
</CSSTransition> */}
