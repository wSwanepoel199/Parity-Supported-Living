import { lazy } from "react";
// import Dashboard from "./Dashboard";
import Appbar from "./Appbar/Appbar";
// const Appbar = lazy(() => import('./Appbar/Appbar'));
// import PasswordReset from "./PasswordReset";
const PasswordReset = lazy(() => import('./PasswordReset'));
// import ProtectedRoute from "./ProtectedRoute";
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
// import CustomAlert from "./CustomAlert";
const CustomAlert = lazy(() => import('./CustomAlert'));
// import PromptForUpdate from "./PrompUpdateServiceWorker";
const PromptForUpdate = lazy(() => import('./PrompUpdateServiceWorker'));
// import GeneralDataGrid from './DataGrid/GeneralDataGrid';
const GeneralDataGrid = lazy(() => import('./DataGrid/GeneralDataGrid'));

export { PasswordReset, ProtectedRoute, Appbar, GeneralDataGrid, CustomAlert, PromptForUpdate };