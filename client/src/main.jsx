import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.jsx";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Authentication from "./components/Authentication.jsx";
import { ChatProvider } from "./context/chatContext.jsx";

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <StrictMode>
      <SignedIn>
        <ChatProvider>
          <RouterProvider router={router} />
        </ChatProvider>
      </SignedIn>
      <SignedOut>
        <Authentication />
      </SignedOut>
    </StrictMode>
  </ClerkProvider>
);
