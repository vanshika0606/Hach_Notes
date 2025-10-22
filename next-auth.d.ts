import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: number; // add your custom property
  }
  interface User {
    userId?: number;
  }
}