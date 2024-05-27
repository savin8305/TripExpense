
import React, { useState } from "react";
import { Paper } from "@mui/material";
import TripHome from "./Components/TripHome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Navbar } from "./Components/Navbar";
import TripPlane from "./Components/TripPlane";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [parentD, setParentData] = useState({})
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  const backgroundClassName = darkMode ? "background dark-mode" : "background";

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: "100vh" }}>
        <Navbar check={darkMode} change={() => setDarkMode(!darkMode)} />
        <div style={{ backgroundColor: darkMode ? "" : "white" }} className={backgroundClassName}>
        </div>
        <Router>
          <Routes>
            <Route exact path='/' element={<TripHome check={darkMode} />} />
            {/* <Route path="/trips" element={<TripPlane />} /> */}
          </Routes>
        </Router>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
