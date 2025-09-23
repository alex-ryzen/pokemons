import { CSSProperties, ReactNode, useState } from 'react';
import styles from './mainLayout.module.css'
import { Outlet } from 'react-router';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { GENERAL_GAP, GENERAL_PADDING, HEADER_HEIGHT } from '../../../store/consts';
import { DndContext } from '@dnd-kit/core';

export interface MainLayoutProps {
    mainContent?: ReactNode;
    siderLContent?: ReactNode;
    siderRContent?: ReactNode;
}

//const mainLayoutStyle: CSSProperties = {}
const asideStyle: CSSProperties = {
    maxHeight: `calc(100% - 2 * ${GENERAL_PADDING}px - ${GENERAL_GAP}px - ${HEADER_HEIGHT}px)`,
}

const MainLayout = ({mainContent, siderLContent, siderRContent}: MainLayoutProps) => {
    const [isDraggingInsideGrid, setIsDraggingInsideGrid] = useState<boolean>(true)
    return (
        <div className={styles.layout}> 
            <DndContext autoScroll={true}>
                <Header/>
                <main className={`${styles['content-layout']}`}>
                    <aside className={`${styles['content-aside']} content-block`} style={{order: 0}}>
                        <div className={styles.asideContentContainer}>
                            {siderLContent}
                        </div>
                    </aside>
                    <div className={styles['content-wrapper']} style={{order: 1}}>
                        {mainContent ? mainContent : <Outlet />}
                    </div>
                    <aside className={`${styles['content-aside']} content-block`} style={{order: 2}}>
                        <div className={styles.asideContentContainer}>
                            {siderRContent}
                        </div>
                    </aside>
                </main>
            </DndContext>
            {/* <Footer/> */}
        </div> 
    );
}

 
export default MainLayout;