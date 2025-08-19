'use client'

import { usePathname } from "next/navigation"
import { AppSidebar } from "./ui/appsidebar"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { User } from "lucide-react"
import Link from "next/link"

const MainLayout = ({ children }: { children: React.ReactNode }) => {

    const path = usePathname()
  


    return (

        path === '/' ?

            <>
                {children}
            </>
            :
            <div className="min-h-screen">
                <SidebarProvider>
                    <AppSidebar />
                    <main className="w-full ">
                        <div className="w-full px-10 py-2 border-b border-gray-300 bg-white flex justify-between items-center">
                            <div><SidebarTrigger /></div>
                            <div className="flex gap-10">
                                        <Link href={'/dashboard'} >
                                            <button className="cursor-pointer hover:text-red-500">Dashboard</button>
                                        </Link>
                                   
                            </div>
                            <div>
                                <Link href={'/profile'} >
                                    <button className="w-10 h-10 border border-gray-500 cursor-pointer rounded-full  flex items-center justify-center"><User /></button></Link>
                            </div>
                        </div>
                        <div className="w-full px-10 py-8">
                            <div className="w-full ">
                                {children}
                            </div>
                        </div>
                    </main>
                </SidebarProvider>

            </div>

    )
}

export default MainLayout