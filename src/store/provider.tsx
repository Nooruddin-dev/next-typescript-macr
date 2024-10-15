'use client';
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux';
import { storeSession } from './store';




// interface ProvidersInterface {
//     children: ReactNode;
//   }




//   const Providers: React.FC<ProvidersInterface> = ({ children }) => {


//     return (
//         <Provider store={store}>
//             {children}
//         </Provider>
//     )
// }
// export default Providers;


export default function Providers({children}: { children: React.ReactNode}) {
    return (
        <Provider store={storeSession}>
            {children}
        </Provider>
    )
}
