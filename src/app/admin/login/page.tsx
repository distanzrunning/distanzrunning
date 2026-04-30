import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Login — Distanz",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--ds-background-200)",
        padding: 24,
      }}
    >
      <LoginForm />
    </main>
  );
}
