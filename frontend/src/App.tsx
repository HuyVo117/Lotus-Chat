import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "./stores/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useSocketStore } from "./stores/useSocketStore";
import { CallProvider } from "./contexts/CallContext";
import CallModal from "./components/call/CallModal";
import IncomingCallDialog from "./components/call/IncomingCallDialog";
import { Buffer } from "buffer";
import PremiumCheckoutPage from "./pages/PremiumCheckoutPage";

// Polyfills cho simple-peer
window.Buffer = Buffer;

// Polyfill process.nextTick
if (!window.process) {
  window.process = {
    env: {},
    nextTick: (callback: Function, ...args: any[]) => {
      setTimeout(() => callback(...args), 0);
    },
  } as any;
} else if (!window.process.nextTick) {
  window.process.nextTick = (callback: Function, ...args: any[]) => {
    setTimeout(() => callback(...args), 0);
  };
}

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return (
    <CallProvider>
      <Toaster richColors />
      <CallModal />
      <IncomingCallDialog />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ChatAppPage />} />
              <Route path="/premium/checkout" element={<PremiumCheckoutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CallProvider>
  );
}

export default App;