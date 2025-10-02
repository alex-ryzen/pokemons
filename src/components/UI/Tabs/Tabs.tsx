// Tabs.tsx
import { FC, ReactNode, useState } from "react";
import { TabConfig } from "../../../types/app";
import styles from "./tabs.module.css"
import { TabIndicatorType } from "../../../hooks/useTabs";

export interface TabsProps {
    tabs: TabConfig[];
    activeTab: string;
    changeTab: (key: string) => void;
    indicator: TabIndicatorType;
    setTabRefs: (el: HTMLButtonElement | null, key: string) => void;
}

export const Tabs: FC<TabsProps> = ({
    tabs,
    activeTab,
    changeTab,
    indicator,
    setTabRefs
}) => {
    return (
        <div className={styles.tabsWrapper}>
            <div className={styles.tabsContainer}>
                <nav className={styles.tabsList} role="tablist">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`${styles.tabBtn}${
                                tab.key === activeTab ? styles.tabBtnActive : ""
                            }`}
                            role="tab"
                            aria-selected={tab.key === activeTab}
                            ref={btn => setTabRefs(btn, tab.key)}
                            tabIndex={tab.key === activeTab ? 0 : -1}
                            onClick={() => changeTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <div
                        className={styles.tabIndicator}
                        style={{
                            left: indicator.left,
                            width: indicator.width,
                        }}
                    />
                </nav>
                <div className={styles.tabsPanel} role="tabpanel">
                    {tabs.find((tab) => tab.key === activeTab)?.content ?? null}
                </div>
            </div>
        </div>
    );
};
