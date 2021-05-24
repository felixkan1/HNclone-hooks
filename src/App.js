import React, { useState } from 'react';
import './App.css';
import Stories from './components/Stories';
import User from './components/User';
import Post from './components/Post';
import Nav from './components/Nav';
import { ThemeProvider } from './context/theme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () =>
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));

  return (
    <Router>
      <ThemeProvider value={theme}>
        <div className={theme}>
          <div className="container">
            <Nav toggleTheme={toggleTheme} />
            <React.Fragment>
              <Route exact path="/" component={Stories} />
              <Route path="/new" component={Stories} />
              <Route path="/user" component={User} />
              <Route path="/post" component={Post} />
            </React.Fragment>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}
