import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
    id: string
    type: "agency" | "subaccount"
}

const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return null
    if (!user.Agency) return null
    const details =
        type === "agency"
            ? user.Agency
            : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)

    if (!details) return null
    const whiteLabeledAgency = user.Agency.whiteLabel

    let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg"

    if (!whiteLabeledAgency) {
        if (type === "subaccount") {
            sideBarLogo = user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo
        }
    }

    const sidebarOpt = type === "agency" ? user.Agency.SidebarOption || [] : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || []

    const subAccounts = user.Agency.SubAccount.filter((subaccount) => user.Permissions.find(permition => permition.subAccountId === subaccount.id && permition.access))

    return (
        <>
            <MenuOptions
                defaultOpen={true}
                details={details}
                id={id}
                sidebarLogo={sideBarLogo}
                sidebarOpt={sidebarOpt}
                subAccounts={subAccounts}
                user={user}
            />
            <MenuOptions
                details={details}
                id={id}
                sidebarLogo={sideBarLogo}
                sidebarOpt={sidebarOpt}
                subAccounts={subAccounts}
                user={user}
            />
        </>
    )
}

export default Sidebar