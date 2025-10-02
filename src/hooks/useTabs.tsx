import { useLayoutEffect, useRef, useState } from "react";
import { TabConfig } from "../types/app";
import { TabsProps } from "../components/UI/Tabs/Tabs";

export type TabIndicatorType = {
    left: number,
    width: number 
}

export function useTabs(tabs: TabConfig[], defaultTab: string): TabsProps {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const [indicator, setIndicator] = useState<TabIndicatorType>({ left: 0, width: 0 });
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const listRef = useRef<HTMLDivElement | null>(null);

    const setTabRefs = (el: HTMLButtonElement | null, key: string) => {
        tabRefs.current = {...tabRefs.current, [key]: el}
    };

    const changeTab = (key: string) => {
        setActiveTab(key ?? defaultTab);
    };

    useLayoutEffect(() => {
        const container = listRef.current;
        const activeButton = tabRefs.current[activeTab];
        if (container && activeButton) {
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeButton.getBoundingClientRect();
            setIndicator({
                left: activeRect.left - containerRect.left,
                width: activeRect.width,
            });
        }
    }, [activeTab, tabs.length]);

    return {
        tabs,
        activeTab,
        changeTab,
        setTabRefs,
        indicator
    };
}
