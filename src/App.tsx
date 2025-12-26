
import { RouterProvider } from 'react-router/dom';
import './App.css'
import { Suspense } from 'react';
import Loader from './components/UI/Loader/Loader';
import { router } from './router';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <Suspense fallback={<Loader/>}>
            <ToastContainer/>
            <RouterProvider router={router}></RouterProvider>
        </Suspense>
    );
}

export default App;

