import { ClerkProvider } from "@clerk/clerk-react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const EXTENSION_URL = browser.runtime.getURL("");

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl={`${EXTENSION_URL}/dashboard.html`}
      signInFallbackRedirectUrl={`${EXTENSION_URL}/dashboard.html`}
      signUpFallbackRedirectUrl={`${EXTENSION_URL}/dashboard.html`}
    >
      <NuqsAdapter>{children}</NuqsAdapter>
    </ClerkProvider>
  );
}
