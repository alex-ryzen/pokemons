import { ReactNode } from 'react';
import stlyes from './layout.module.css'

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({children} : LayoutProps) => {
    return ( 
        <div className={stlyes.layout}>
           <Header></Header>
           <main>
                {children}
           </main>
           <Footer></Footer> 
        </div>
    );
}
 
export default Layout;