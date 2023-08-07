import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Backdrop, CircularProgress, StyledEngineProvider } from '@mui/material';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';
import store from './Redux/store';
import reportWebVitals from './reportWebVitals';

import './index.css';
import router from './router';


// const App = lazy(() => import('./App'));


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <RouterProvider
          router={createBrowserRouter(router)}
          fallbackElement={<Backdrop
            open={true}
            className={`z-40`}
          >
            <CircularProgress className='text-psl-active-link' />
          </Backdrop>}
        />
      </StyledEngineProvider>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// window.updateAvailable.resolve(false);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(process.env.NODE_ENV === "production" ? null : console.log);
