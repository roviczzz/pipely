export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (NextAuth API route + other API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (metadata file)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};