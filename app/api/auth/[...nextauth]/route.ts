import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Assign fixed internal id only on first login
      if (user && !token.userId) {
        (token as any).userId = 101; // cast token to any
      }
      return token;
    },
    async session({ session, token }) {
      // Attach userId to session object
      (session as any).userId = (token as any).userId as number;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
