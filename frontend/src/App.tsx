import { BrowserRouter, Routes, Route } from 'react-router'

import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ChatAppPage from './pages/ChatAppPage';
import { Toaster } from 'sonner';
import { useThemeStore } from './stores/useThemeStore';
import { useEffect } from 'react';

function App() {
const {isDark, setTheme} = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);


  return (
    <>
      <Toaster  richColors/>
      <BrowserRouter>
        <Routes>

          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          <Route path="/" element={<ChatAppPage />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
