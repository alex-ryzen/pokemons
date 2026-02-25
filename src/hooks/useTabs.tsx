import { useState } from "react";
import { TabConfig } from "../types/app";
import { TabsProps } from "../components/UI/Tabs/Tabs";

export function useTabs(tabs: TabConfig[], defaultTab: string, _isQueryParamed?: boolean): TabsProps {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const changeTab = (key: string) => {
        setActiveTab(key ?? defaultTab);
    };
    return {
        tabs,
        activeTab,
        changeTab,
    };
}
