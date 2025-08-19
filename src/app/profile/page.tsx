'use client'
import { useUserContext } from '@/context/UserContext'
import { User } from 'lucide-react'
import React from 'react'

const Page = () => {
    const { userDetail } = useUserContext()
    return (
        <div className='w-full flex justify-center'>
            <div className='w-fit min-w-120 rounded-md py-8 bg-white border-gray-300'>

                <div className='w-full flex justify-center'>
                    <div className='bg-gray-700 text-white p-4 w-fit rounded-full'>
                        <User size={54} />
                    </div>
                </div>

                <div className='mx-auto w-60 mt-10 space-y-4'>
                    <div className='flex justify-between'>
                        <div>Username:</div>
                        <div>{userDetail?.username}</div>
                    </div>
                    <div className='flex justify-between'>
                        <div>Contact:</div>
                        <div>9800000000</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page