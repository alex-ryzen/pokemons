import { FC, useRef, useEffect, useCallback } from "react";
import { TabConfig } from "../../../types/app";
import styles from "./tabs.module.css";

export interface TabsProps {
    tabs: TabConfig[];
    activeTab: string;
    changeTab: (key: string) => void;
}

const tab_easing = "cubic-bezier(0.2, 0.8, 0.2, 1)"

export const Tabs: FC<TabsProps> = ({ tabs, activeTab, changeTab }) => {
    const activeIndex = tabs.findIndex((t) => t.key === activeTab);
    const trackRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const tabsRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const state = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        currentTranslate: 0,
        width: 0,
        isLocked: false,
        wheelAccumulator: 0,
        wheelTimeout: 0
    });

    const render = useCallback((progress: number, animate: boolean) => {
        if (trackRef.current) {
            trackRef.current.style.transition = animate 
                ? `transform 0.3s ${tab_easing}`
                : 'none';
            trackRef.current.style.transform = `translateX(${-progress * 100}%)`;
        }

        const indicator = indicatorRef.current;
        if (indicator) {
            const clamped = Math.max(0, Math.min(progress, tabs.length - 1));
            const leftIndex = Math.floor(clamped);
            const rightIndex = Math.ceil(clamped);
            const ratio = clamped - leftIndex;

            const leftTab = tabsRefs.current[leftIndex];
            const rightTab = tabsRefs.current[rightIndex];

            if (leftTab) {
                const lOff = leftTab.offsetLeft;
                const lWidth = leftTab.offsetWidth;
                const rOff = rightTab?.offsetLeft ?? lOff;
                const rWidth = rightTab?.offsetWidth ?? lWidth;

                const currentLeft = lOff + (rOff - lOff) * ratio;
                const currentWidth = lWidth + (rWidth - lWidth) * ratio;

                indicator.style.transition = animate 
                    ? 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                    : 'none';
                indicator.style.transform = `translateX(${currentLeft}px)`;
                indicator.style.width = `${currentWidth}px`;
                indicator.style.opacity = '1';
            }
        }
    }, [tabs.length]);

    useEffect(() => {
        if (!state.current.isDragging && !state.current.isLocked) {
            render(activeIndex, true);
        }
    }, [activeIndex, render]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onDragStart = (e: TouchEvent | MouseEvent) => {
            const target = e.target as HTMLElement;
            const excludeTags = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'SPAN', 'P', 'B', 'I', 'STRONG', 'EM', 'LABEL', 'H1', 'H2', 'H3'];
            if (excludeTags.includes(target.tagName) || target.isContentEditable) {
                return;
            }
            if (state.current.isLocked) return;
            if ('button' in e && e.button !== 0) return;

            state.current.isDragging = true;
            state.current.width = el.offsetWidth;
            state.current.currentTranslate = 0;
            
            if ('touches' in e) {
                state.current.startX = e.touches[0].clientX;
                state.current.startY = e.touches[0].clientY;
            } else {
                state.current.startX = e.clientX;
                state.current.startY = e.clientY;
            }

            if (trackRef.current) trackRef.current.style.transition = 'none';
            if (indicatorRef.current) indicatorRef.current.style.transition = 'none';
        };

        const onDragMove = (e: TouchEvent | MouseEvent) => {
            if (!state.current.isDragging) return;

            let cx, cy;
            if ('touches' in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; } 
            else { cx = e.clientX; cy = e.clientY; }

            const dx = cx - state.current.startX;
            const dy = cy - state.current.startY;

            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 10) return;
            if (e.cancelable) e.preventDefault();

            const offset = -dx / state.current.width;
            render(activeIndex + offset, false);
            state.current.currentTranslate = dx;
        };

        const onDragEnd = () => {
            if (!state.current.isDragging) return;
            state.current.isDragging = false;

            const threshold = 0.2;
            const movedPercent = -state.current.currentTranslate / state.current.width;
            
            let next = activeIndex;
            if (movedPercent > threshold && activeIndex < tabs.length - 1) next++;
            else if (movedPercent < -threshold && activeIndex > 0) next--;

            render(next, true);
            if (next !== activeIndex) changeTab(tabs[next].key);
        };

        const onWheel = (e: WheelEvent) => {
            if (state.current.isLocked || state.current.isDragging) {
                if (e.cancelable) e.preventDefault(); 
                return;
            }

            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
            if (e.cancelable) e.preventDefault();
            state.current.wheelAccumulator += e.deltaX;
            const THRESHOLD = 40; 

            if (state.current.wheelAccumulator > THRESHOLD) {
                handleWheelSwipe(1);
            } else if (state.current.wheelAccumulator < -THRESHOLD) {
                handleWheelSwipe(-1);
            }

            clearTimeout(state.current.wheelTimeout);
            state.current.wheelTimeout = window.setTimeout(() => {
                state.current.wheelAccumulator = 0;
            }, 100);
        };

        const handleWheelSwipe = (direction: number) => {
            const nextIndex = activeIndex + direction;

            if (nextIndex >= 0 && nextIndex < tabs.length) {
                state.current.isLocked = true;
                state.current.wheelAccumulator = 0;

                render(nextIndex, true);
                changeTab(tabs[nextIndex].key);
                setTimeout(() => {
                    state.current.isLocked = false;
                }, 350); 
            } else {
                state.current.wheelAccumulator = 0;
            }
        };
        el.addEventListener('touchstart', onDragStart, { passive: true });
        el.addEventListener('touchmove', onDragMove, { passive: false });
        el.addEventListener('touchend', onDragEnd);
        
        el.addEventListener('mousedown', onDragStart);
        window.addEventListener('mousemove', onDragMove);
        window.addEventListener('mouseup', onDragEnd);
        
        el.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            el.removeEventListener('touchstart', onDragStart);
            el.removeEventListener('touchmove', onDragMove);
            el.removeEventListener('touchend', onDragEnd);
            el.removeEventListener('mousedown', onDragStart);
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            el.removeEventListener('wheel', onWheel);
            clearTimeout(state.current.wheelTimeout);
        };
    }, [activeIndex, tabs.length, changeTab, render]);

    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabsContainer}>
                <nav className={styles.tabsNavbar}>
                    {tabs.map((tab, i) => {
                        const isActive = tab.key === activeTab;
                        return(
                            <button
                                key={tab.key}
                                ref={(el) => { tabsRefs.current[i] = el; }}
                                id={`tab-${tab.key}`}
                                name={`tab-${tab.key}`}
                                aria-label={`tab-${tab.key}`}
                                aria-controls={`tabpanel-${tab.key}`}
                                data-testid={`tab-${tab.key}`}
                                role="tab"
                                aria-selected={isActive}
                                className={`${styles.tabBtn} ${
                                    isActive ? styles.tabBtnActive : ""
                                }`}
                                
                                onClick={() => changeTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        )}
                    )}
                    <div ref={indicatorRef} className={styles.tabIndicator} />
                </nav>
                <div className={styles.swipeViewport} ref={containerRef}>
                    <div className={styles.swipeTrack} ref={trackRef}>
                        {tabs.map((tab) => (
                            <div
                                id={`tabpanel-${tab.key}`}
                                aria-label={`tabpanel-${tab.key}`}
                                data-testid={`tabpanel-${tab.key}`}
                                role="tabpanel" 
                                key={tab.key} 
                                className={styles.tabPanel}
                            >
                                {tab.content}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



// ===== PREV REALIZATION =====

// import { FC, useRef, useEffect, useCallback } from "react";
// import { TabConfig } from "../../../types/app";
// import styles from "./tabs.module.css";

// export interface TabsProps {
//     tabs: TabConfig[];
//     activeTab: string;
//     changeTab: (key: string) => void;
// }

// export const Tabs: FC<TabsProps> = ({ tabs, activeTab, changeTab }) => {
//     const activeIndex = tabs.findIndex((t) => t.key === activeTab);
    
//     const trackRef = useRef<HTMLDivElement>(null);
//     const indicatorRef = useRef<HTMLDivElement>(null);
//     const tabsRefs = useRef<(HTMLButtonElement | null)[]>([]);
//     const containerRef = useRef<HTMLDivElement>(null);

//     const state = useRef({
//         isDragging: false,
//         currentTranslate: 0,
//         width: 0,
//         startX: 0,
//         startY: 0,
//         isLocked: false,
//         wheelTimeout: 0 as unknown as number
//     });

//     const render = useCallback((progress: number, animate: boolean) => {
//         const clampedProgress = Math.max(-0.1, Math.min(tabs.length - 0.9, progress));

//         if (trackRef.current) {
//             trackRef.current.style.transition = animate 
//                 ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
//                 : 'none';
//             trackRef.current.style.transform = `translateX(${-clampedProgress * 100}%)`;
//         }

//         const indicator = indicatorRef.current;
//         if (indicator) {
//             const clamped = Math.max(0, Math.min(progress, tabs.length - 1));
//             const leftIndex = Math.floor(clamped);
//             const rightIndex = Math.ceil(clamped);
//             const ratio = clamped - leftIndex;

//             const leftTab = tabsRefs.current[leftIndex];
//             const rightTab = tabsRefs.current[rightIndex];

//             if (leftTab) {
//                 const lOff = leftTab.offsetLeft;
//                 const lWidth = leftTab.offsetWidth;
//                 const rOff = rightTab?.offsetLeft ?? lOff;
//                 const rWidth = rightTab?.offsetWidth ?? lWidth;

//                 const currentLeft = lOff + (rOff - lOff) * ratio;
//                 const currentWidth = lWidth + (rWidth - lWidth) * ratio;

//                 indicator.style.transition = animate 
//                     ? 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' 
//                     : 'none';
//                 indicator.style.transform = `translateX(${currentLeft}px)`;
//                 indicator.style.width = `${currentWidth}px`;
//                 indicator.style.opacity = '1';
//             }
//         }
//     }, [tabs.length]);

//     useEffect(() => {
//         if (!state.current.isDragging && !state.current.isLocked) {
//             render(activeIndex, true);
//         }
//     }, [activeIndex]);

//     useEffect(() => {
//         const el = containerRef.current;
//         if (!el) return;

//         const onDragStart = (e: TouchEvent | MouseEvent) => {
//             if ('button' in e && e.button !== 0) return;
//             if (state.current.isLocked) return;

//             state.current.isDragging = true;
//             state.current.width = el.offsetWidth;
//             state.current.currentTranslate = 0;
            
//             if ('touches' in e) {
//                 state.current.startX = e.touches[0].clientX;
//                 state.current.startY = e.touches[0].clientY;
//             } else {
//                 state.current.startX = e.clientX;
//                 state.current.startY = e.clientY;
//             }

//             if (trackRef.current) trackRef.current.style.transition = 'none';
//             if (indicatorRef.current) indicatorRef.current.style.transition = 'none';
//         };

//         const onDragMove = (e: TouchEvent | MouseEvent) => {
//             if (!state.current.isDragging) return;

//             let cx, cy;
//             if ('touches' in e) { cx = e.touches[0].clientX; cy = e.touches[0].clientY; } 
//             else { cx = e.clientX; cy = e.clientY; }

//             const dx = cx - state.current.startX;
//             const dy = cy - state.current.startY;

//             if (Math.abs(dy) > Math.abs(dx) && Math.abs(dx) < 10) return;
//             if (e.cancelable) e.preventDefault();

//             const offset = -dx / state.current.width;
//             render(activeIndex + offset, false);
//             state.current.currentTranslate = dx;
//         };

//         const onDragEnd = () => {
//             if (!state.current.isDragging) return;
//             state.current.isDragging = false;
//             finishSwipe(state.current.currentTranslate, false);
//         };
        

//         let isWheelGestureActive = false;
//         let ignoreInertia = false; 

//         const onWheel = (e: WheelEvent) => {
//             if (isWheelGestureActive) {
//                 if (e.cancelable) e.preventDefault();
//             } else {
//                 if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
//                      isWheelGestureActive = true;
//                      if (e.cancelable) e.preventDefault();
//                 } else {
//                      return;
//                 }
//             }

//             if (state.current.isLocked) return;
//             if (ignoreInertia) {
//                 if (Math.abs(e.deltaX) < 40) { 
//                     clearTimeout(state.current.wheelTimeout);
//                     state.current.wheelTimeout = window.setTimeout(() => {
//                         ignoreInertia = false;
//                         isWheelGestureActive = false;
//                     }, 60);
//                     return; 
//                 } else {
//                     ignoreInertia = false;
//                 }
//             }

//             if (!state.current.isDragging) {
//                 state.current.isDragging = true;
//                 state.current.width = el.offsetWidth;
//                 state.current.currentTranslate = 0;
                
//                 if (trackRef.current) trackRef.current.style.transition = 'none';
//                 if (indicatorRef.current) indicatorRef.current.style.transition = 'none';
//             }

//             const dx = -e.deltaX; 
//             state.current.currentTranslate += dx;

//             const FLICK = 50;
//             if (Math.abs(e.deltaX) > FLICK) {
//                 const isNext = e.deltaX > 0;
//                 if ((isNext && activeIndex < tabs.length - 1) || (!isNext && activeIndex > 0)) {
//                     const fakeTranslate = isNext ? -1000 : 1000;
//                     finishSwipe(fakeTranslate, true);
//                     return; 
//                 }
//             }

//             const offset = -state.current.currentTranslate / state.current.width;
//             const clampedOffset = Math.max(-1.0, Math.min(1.0, offset));
//             render(activeIndex, false);
            
//             clearTimeout(state.current.wheelTimeout);
//             state.current.wheelTimeout = window.setTimeout(onWheelStop, 60);
//         };

//         const onWheelStop = () => {
//              if (state.current.isDragging) {
//                  finishSwipe(state.current.currentTranslate, false);
//              } else {
//                  isWheelGestureActive = false;
//                  ignoreInertia = false;
//              }
//         };

//         const finishSwipe = (translatePx: number, isFlick: boolean) => {
//             state.current.isDragging = false;
//             state.current.isLocked = true; 

//             const width = state.current.width || el.offsetWidth;
//             const movedPercent = -translatePx / width;
//             let nextIndex = activeIndex;
//             const threshold = 0.3;

//             if (isFlick) {
//                 if (translatePx < 0 && activeIndex < tabs.length - 1) nextIndex++;
//                 else if (translatePx > 0 && activeIndex > 0) nextIndex--;
//             } else {
//                 if (movedPercent > threshold && activeIndex < tabs.length - 1) nextIndex++;
//                 else if (movedPercent < -threshold && activeIndex > 0) nextIndex--;
//             }

//             render(nextIndex, true);

//             if (nextIndex !== activeIndex) {
//                 changeTab(tabs[nextIndex].key);
//             }
            
//             setTimeout(() => {
//                 state.current.isLocked = false;
//                 state.current.currentTranslate = 0;

//                 ignoreInertia = true; 
                
//                 clearTimeout(state.current.wheelTimeout);
//                 state.current.wheelTimeout = window.setTimeout(() => {
//                     ignoreInertia = false;
//                     isWheelGestureActive = false;
//                 }, 100);
//             }, 300);
//         };

//         el.addEventListener('touchstart', onDragStart, { passive: true });
//         el.addEventListener('touchmove', onDragMove, { passive: false });
//         el.addEventListener('touchend', onDragEnd);
        
//         el.addEventListener('mousedown', onDragStart);
//         window.addEventListener('mousemove', onDragMove);
//         window.addEventListener('mouseup', onDragEnd);
        
//         el.addEventListener('wheel', onWheel, { passive: false });

//         return () => {
//             el.removeEventListener('touchstart', onDragStart);
//             el.removeEventListener('touchmove', onDragMove);
//             el.removeEventListener('touchend', onDragEnd);
//             el.removeEventListener('mousedown', onDragStart);
//             window.removeEventListener('mousemove', onDragMove);
//             window.removeEventListener('mouseup', onDragEnd);
//             el.removeEventListener('wheel', onWheel);
//             clearTimeout(state.current.wheelTimeout);
//         };
//     }, [activeIndex, tabs.length, changeTab, render]);

//     return (
//         <div className={styles.tabsWrapper}>
//             <div className={styles.tabsContainer}>
//                 <nav className={styles.tabsNavbar}>
//                     {tabs.map((tab, i) => (
//                         <button
//                             key={tab.key}
//                             ref={(el) => { tabsRefs.current[i] = el; }}
//                             className={`${styles.tabBtn} ${
//                                 tab.key === activeTab ? styles.tabBtnActive : ""
//                             }`}
//                             onClick={() => changeTab(tab.key)}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                     <div ref={indicatorRef} className={styles.tabIndicator} />
//                 </nav>

//                 <div className={styles.swipeViewport} ref={containerRef}>
//                     <div className={styles.swipeTrack} ref={trackRef}>
//                         {tabs.map((tab) => (
//                             <div key={tab.key} className={styles.tabPanelItem}>
//                                 {tab.content}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };



// ===== OLD REALIZATION =====

// import { FC, ReactNode, useState } from "react";
// import { TabConfig } from "../../../types/app";
// import styles from "./tabs.module.css"
// import { TabIndicatorType } from "../../../hooks/useTabs";

// export interface TabsProps {
//     tabs: TabConfig[];
//     activeTab: string;
//     changeTab: (key: string) => void;
//     indicator: TabIndicatorType;
//     setTabRefs: (el: HTMLButtonElement | null, key: string) => void;
// }

// export const Tabs: FC<TabsProps> = ({
//     tabs,
//     activeTab,
//     changeTab,
//     indicator,
//     setTabRefs
// }) => {
//     return (
//         <div className={styles.tabsWrapper}>
//             <div className={styles.tabsContainer}>
//                 <nav className={styles.tabsNavbar} role="tablist">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.key}
//                             className={`${styles.tabBtn} ${
//                                 tab.key === activeTab ? styles.tabBtnActive : ""
//                             }`}
//                             role="tab"
//                             aria-selected={tab.key === activeTab}
//                             ref={btn => setTabRefs(btn, tab.key)}
//                             tabIndex={tab.key === activeTab ? 0 : -1}
//                             onClick={() => changeTab(tab.key)}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                     <div
//                         className={styles.tabIndicator}
//                         style={{
//                             left: indicator.left,
//                             width: indicator.width,
//                         }}
//                     />
//                 </nav>
//                 <div className={styles.tabsPanel} role="tabpanel">
//                     {tabs.find((tab) => tab.key === activeTab)?.content ?? null}
//                 </div>
//             </div>
//         </div>
//     );
// };
