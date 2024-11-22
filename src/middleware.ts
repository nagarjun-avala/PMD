import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(
    ['/', '/site', '/api/uploadthing', '/agency/sign-in(.*)', '/agency/sign-up(.*)']
);

async function afterAuth(req: NextRequest) {
    //rewrite for domains
    const url = req.nextUrl
    const searchParams = url.searchParams.toString()
    let hostname = req.headers

    const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''
        }`

    //if subdomain exists
    const customSubDomain = hostname
        .get('host')
        ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
        .filter(Boolean)[0]

    if (customSubDomain) {
        return NextResponse.rewrite(
            new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
        )
    }

    if (url.pathname === '/sign-in' || url.pathname === '/sign-up') {
        return NextResponse.redirect(new URL(`/agency/sign-in`, req.url))
    }
    // console.log("Checking if root url")
    if (
        url.pathname === '/' ||
        (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
        // console.log("Confirmed Root URL")
        return NextResponse.rewrite(new URL('/site', req.url))
    }

    if (
        url.pathname.startsWith('/agency') ||
        url.pathname.startsWith('/subaccount')
    ) {
        return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url))
    }
}

async function beforeAuth(req: NextRequest) {
    //rewrite for domains
    const url = req.nextUrl

    if (
        url.pathname === '/' ||
        (url.pathname === '/site' && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
        return NextResponse.rewrite(new URL('/site', req.url))
    }
}

export default clerkMiddleware(async (auth, request) => {
    const { userId } = await auth();

    if (userId) {
        // console.log(" authenticated")
        afterAuth(request);
    }
    else {
        // console.log(" not authenticated")
        beforeAuth(request)
    }

    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};