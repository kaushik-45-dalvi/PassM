import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Shield } from "lucide-react";

export default function SignInPage() {
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
          marginBottom: "28px"
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

      <SignIn
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
              maxWidth: "440px",
            },
            card: {
              border: "3px solid #000000",
              boxShadow: "8px 8px 0 #000000",
              borderRadius: "26px",
              background: "#FFFFFF",
              padding: "28px 24px",
            },
            headerTitle: {
              color: "#000000",
              fontWeight: "900",
              fontSize: "1.35rem",
            },
            headerSubtitle: {
              color: "#475569",
              fontSize: "0.88rem",
            },
            formButtonPrimary: {
              background: "#000000",
              color: "#FFFFFF",
              borderRadius: "50px",
              fontWeight: "800",
              border: "2px solid #000000",
              fontSize: "0.92rem",
              boxShadow: "2px 2px 0 #000000",
              transition: "all 0.15s ease",
            },
            formFieldInput: {
              border: "2px solid #000000",
              borderRadius: "12px",
              fontSize: "0.92rem",
            },
            footerActionLink: {
              color: "#000000",
              fontWeight: "800",
              textDecoration: "underline",
            }
          }
        }}
      />
    </div>
  );
}
