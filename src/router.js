
import {
  Route,
  createRoutesFromElements
} from 'react-router-dom';

import { Suspense, lazy } from 'react';
import { Backdrop, Box, CircularProgress } from '@mui/material';

import App from './App';
import { ProtectedRoute } from './Components';
import { SignIn, Landing, Notes, Users, Clients } from './Pages';

// import CreateNote from './Pages/Note/CreateNote/CreateNote';
// import UpdateNote from './Pages/Note/UpdateNote/UpdateNote';
// import ViewNote from './Pages/Note/ViewNote/ViewNote';
// import DeleteNote from './Pages/Note/DeleteNote/DeleteNote';

const CreateNote = lazy(() => import('./Pages/Note/CreateNote/CreateNote'));
const UpdateNote = lazy(() => import('./Pages/Note/UpdateNote/UpdateNote'));
const ViewNote = lazy(() => import('./Pages/Note/ViewNote/ViewNote'));
const DeleteNote = lazy(() => import('./Pages/Note/DeleteNote/DeleteNote'));

// import CreateClient from './Pages/Client/CreateClient/CreateClient';
// import UpdateClient from './Pages/Client/UpdateClient/UpdateClient';
// import ViewClient from './Pages/Client/ViewClient/ViewClient';
// import DeleteClient from './Pages/Note/DeleteClient/DeleteClient';

const CreateClient = lazy(() => import('./Pages/Client/CreateClient/CreateClient'));
const UpdateClient = lazy(() => import('./Pages/Client/UpdateClient/UpdateClient'));
const ViewClient = lazy(() => import('./Pages/Client/ViewClient/ViewClient'));
const DeleteClient = lazy(() => import('./Pages/Client/DeleteClient/DeleteClient'));

// import CreateUser from './Pages/User/CreateUser/CreateUser';
// import UpdateUser from './Pages/User/UpdateUser/UpdateUser';
// import ViewUser from './Pages/User/ViewUser/ViewUser';
// import DeleteUser from './Pages/Note/DeleteUser/DeleteUser';

const CreateUser = lazy(() => import('./Pages/User/CreateUser/CreateUser'));
const UpdateUser = lazy(() => import('./Pages/User/UpdateUser/UpdateUser'));
const ViewUser = lazy(() => import('./Pages/User/ViewUser/ViewUser'));
const DeleteUser = lazy(() => import('./Pages/User/DeleteUser/DeleteUser'));


const router = createRoutesFromElements(
  <Route
    element={<App />}
  >
    <Route path="/" element={<Suspense fallback={
      <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
        <CircularProgress />
      </Box>
    }>
      <Landing />
    </Suspense>
    } >
      <Route
        path="signin"
        element={<SignIn />}

      />
      <Route path="notes" //Routing system implimented, need to convert view and delete to use routes, need to impliment dark mode styling
        element={
          <Suspense fallback={
            <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
              <CircularProgress />
            </Box>
          }>
            <Notes />
          </Suspense>
        } >
        <Route
          path="new"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <CreateNote />
            </Suspense>
          } />
        <Route
          path="edit/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <UpdateNote />
            </Suspense>
          } />
        <Route
          path="view/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <ViewNote />
            </Suspense>
          } />
        <Route
          path="delete/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <DeleteNote />
            </Suspense>
          } />
      </Route>
      <Route path="clients" //Routing system implimented, need to convert view and delete to use routes, need to impliment dark mode styling
        element={
          <Suspense fallback={
            <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
              <CircularProgress />
            </Box>
          }>
            <Clients />
          </Suspense>
        }>
        <Route
          path="new"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <CreateClient />
            </Suspense>
          } />
        <Route
          path="edit/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <UpdateClient />
            </Suspense>
          } />
        <Route
          path="view/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <ViewClient />
            </Suspense>
          } />
        <Route
          path="delete/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <DeleteClient />
            </Suspense>
          } />
      </Route>
      <Route path="users" //Routing system implimented, need to convert view and delete to use routes, need to impliment dark mode styling
        element={
          <ProtectedRoute>
            <Suspense fallback={
              <Box className={`h-full flex-grow flex justify-center items-center z-40`}>
                <CircularProgress />
              </Box>
            }>
              <Users />
            </Suspense>
          </ProtectedRoute>
        }>
        <Route
          path="new"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <CreateUser />
            </Suspense>
          } />
        <Route
          path="edit/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <UpdateUser />
            </Suspense>
          } />
        <Route
          path="view/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <ViewUser />
            </Suspense>
          } />
        <Route
          path="delete/:id"
          element={
            <Suspense fallback={
              <Backdrop
                open={true}
                className={`z-40`}
              >
                <CircularProgress />
              </Backdrop>
            }>
              <DeleteUser />
            </Suspense>
          } />
      </Route>
    </Route>
  </Route>
);

export default router;