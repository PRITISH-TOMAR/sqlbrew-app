import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { MuiThemeProvider } from './theme/index.jsx';
import { SidebarProvider }  from './context/SidebarContext.jsx';
import Layout               from './components/global/Layout.jsx';
import ResetPassword        from './components/auth/ResetPassword.jsx';

export default function App() {
  return (
    <MuiThemeProvider>
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/credentials/:resetKey" element={<ResetPassword />} />
            <Route path="*"                      element={<Layout />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}
