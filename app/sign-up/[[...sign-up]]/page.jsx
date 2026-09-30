'use client';

import Link from "next/link";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 12%, rgba(181, 242, 183, 0.45) 0%, #FAF7EE 65%)",
        padding: "32px 16px",
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Top Brand Link */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
          color: "#000000",
          fontWeight: 900,
          fontSize: "1.35rem",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            background: "#B5F2B7",
            border: "2.5px solid #000000",
            borderRadius: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2.5px 2.5px 0 #000000"
          }}
        >
          <Shield size={20} strokeWidth={2.6} color="#000000" />
        </div>
        <span>VaultSync</span>
      </Link>

      <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ClerkLoading>
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "36px 24px",
              background: "#FFFFFF",
              border: "3px solid #000000",
              borderRadius: "24px",
              boxShadow: "6px 6px 0 #000000",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px"
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "3px solid #E2E8F0",
                borderTopColor: "#16A34A",
                animation: "spin 0.7s linear infinite"
              }}
            />
            <p style={{ fontWeight: 800, color: "#000000", fontSize: "0.95rem" }}>
              Loading Registration...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </ClerkLoading>

        <ClerkLoaded>
          <SignUp
            path="/sign-up"
            routing="path"
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/dashboard"
            signInUrl="/sign-in"
          />
        </ClerkLoaded>
      </div>
    </div>
  );
}
