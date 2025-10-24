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
      // Allow token to have any extra property without casting to 'any'
      const t = token as typeof token & { userId?: number };
      if (user && !t.userId) {
        t.userId = 101;
      }
      return t;
    },

    async session({ session, token }) {
      // Attach userId from token to session
      const t = token as typeof token & { userId?: number };
      return {
        ...session,
        userId: t.userId,
      };
    },
  },
});

export { handler as GET, handler as POST };
