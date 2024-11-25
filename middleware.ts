import { NextResponse } from 'next/server';

export async function middleware(req: any) {
    // const validationResponse = await fetch('http://localhost:8000/auth/user/', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   console.log(validationResponse);

    //   if (!validationResponse.ok) {
    //     const loginUrl = new URL('/login', req.url);
    //     return NextResponse.redirect(loginUrl);
    //   }

      return NextResponse.next();
}

export const config = {
    matcher: ['/feed'],
  };