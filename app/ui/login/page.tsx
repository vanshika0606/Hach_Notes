"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {

   const { data: session } = useSession();
   const router = useRouter();
   useEffect(() => {
    if (session) {
      
      router.push(`/ui/notes?userId=${session.userId}`);// redirect to your notes route
    }
  }, [session, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      {/* Login Card */}
      <div className="glass rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white">
            Welcome
          </h1>
          <p className="text-gray-300 text-lg">
            Sign in to continue to your account
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={() => signIn("google")}
            className="w-full glass glass-hover rounded-xl px-6 py-4 text-white font-semibold text-lg flex items-center justify-center gap-3 group"
          >
            <svg className="w-6 h-6" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="relative top-8 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">
                Secure authentication
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
