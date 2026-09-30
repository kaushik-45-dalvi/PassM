'use client';

import Link from "next/link";
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import VaultSyncLogo from "@/app/components/VaultSyncLogo";

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
      <div style={{ marginBottom: "24px" }}>
        <VaultSyncLogo size={38} fontSize="1.45rem" href="/" />
      </div>

      <div style={{ width: "100%", maxWidth: "440px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ClerkLoading>
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "48px 24px",
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "14px"
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "3px solid #E2E8F0",
                borderTopColor: "#16A34A",
                animation: "spin 0.7s linear infinite"
              }}
            />
            <p style={{ fontWeight: 600, color: "#64748B", fontSize: "0.90rem" }}>
              Loading registration...
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
