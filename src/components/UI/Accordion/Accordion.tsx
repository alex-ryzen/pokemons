import { useEffect, useRef, useState } from "react";
import BlockTitle from "../BlockTitle/BlockTitle";
import style from './accordion.module.css'
import { ACCORDION_HEIGHT, ACCORDIONS_GAP, CONTENT_MARGIN_TOP, GENERAL_GAP, GENERAL_PADDING, HEADER_HEIGHT } from "../../../store/consts";


interface AccordionProps {
  isOpen: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  sectionsCount: number;
}

function Accordion({ isOpen, title, onClick, children, sectionsCount }: AccordionProps) {

    return (
        <div
            className={`${style.accordion} content-block ${
                isOpen ? style["accordion--open"] : ""
            }`}
        >
            <div className={style["accordion-header-container"]}
                onClick={onClick}
            >
                <BlockTitle
                    extClassName={`${style["accordion-header"]}`}
                >
                    {title}
                </BlockTitle>
                <svg
                    className={`${style['accordion-arrow-icon']} ${
                        isOpen ? style["accordion-arrow-icon--open"] : ""
                    }`}
                    width="18"
                    height="11"
                    viewBox="0 0 18 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8.99996 10.9745L17.2378 2.73784L14.7621 0.262168L8.99996 6.0255L3.23779 0.262169L0.762124 2.73784L8.99996 10.9745Z"
                        fill="var(--secondary-color)"
                    />
                </svg>
            </div>
            <div className={`${style["accordion-content-wrapper"]} ${
                        isOpen ? style["accordion-content-wrapper--open"] : ""
                    }`}>
                <div
                    className={`${style["accordion-content"]} ${
                        isOpen ? style["accordion-content--open"] : ""
                    }`}
                    aria-hidden={!isOpen}
                    style={ isOpen ? {maxHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${GENERAL_PADDING}px * 2 - ${GENERAL_GAP}px - ${sectionsCount} * ${ACCORDION_HEIGHT}px - ${sectionsCount - 1} * ${ACCORDIONS_GAP}px - ${CONTENT_MARGIN_TOP}px)`} : {}} //100vh - header - generalPadding(top and bot) - generalGap - sectionCount * accordionHeight - (sectionCount-1 (it is accordionsGapCount)) * accordionsGap - contentMarginTop 
                >
                    <div className={style["accordion-inner"]}>{children}</div>
                </div>
            </div>
            
        </div>
    );
}

export default Accordion;
