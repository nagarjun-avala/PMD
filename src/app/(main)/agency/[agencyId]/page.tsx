import AgencyDetails from '@/components/forms/agency-details'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = async ({
    params,
}: {
    params: { agencyId: string }
}) => {

    return (
        <div className="flex justify-center items-center mt-4">
            <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
                <h1 className="text-4xl">Agency ID - {params?.agencyId}</h1>
            </div>
        </div>
    )
}

export default Page