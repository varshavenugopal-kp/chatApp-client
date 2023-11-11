
import ProtectedRouter from '@/Components/ProtectRouter/ProtectRouter'
import react, { ReactNode } from 'react'

const Layout: React.FC<{children: ReactNode}> = ({children})=>{
    return(
        <div>
            <ProtectedRouter>
            {children}
            </ProtectedRouter>
            
        </div>
    )
}

export default Layout