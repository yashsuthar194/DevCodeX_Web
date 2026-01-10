/**
 * DevCodeX Application Entry Point
 * 
 * Initializes the React application with StrictMode.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/index.css';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Check index.html.');
}

// Create and render root
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
