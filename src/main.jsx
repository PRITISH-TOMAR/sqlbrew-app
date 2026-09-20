import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './tailwind.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.js';
import CustomToaster from './components/global/CustomToaster.jsx';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <CustomToaster />
    </PersistGate>
  </Provider>
);
