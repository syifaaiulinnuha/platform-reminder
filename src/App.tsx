import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Deadlines from "./pages/Deadlines";
import CalendarPage from "./pages/Calendar";
import Notes from "./pages/Notes";
import FocusPage from "./pages/Focus";
import Academic from "./pages/Academic";
import Analytics from "./pages/Analytics";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deadlines" element={<Deadlines />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
