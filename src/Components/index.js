import { lazy } from "react";
import Appbar from "./Appbar/Appbar";
import CustomAlert from "./CustomAlert";
// const CustomAlert = lazy(() => import('./CustomAlert'));
// import PasswordReset from "./PasswordReset";
const PasswordReset = lazy(() => import('./PasswordReset'));
// import ProtectedRoute from "./ProtectedRoute";
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));
// import PromptForSWUpdate from "./PromptForSWUpdate";
const PromptForSWUpdate = lazy(() => import('./PromptForSWUpdate'));
// import PromptForAppInstall from "./PromptForAppInstall";
const PromptForAppInstall = lazy(() => import('./PromptForAppInstall'));
// import GeneralDataGrid from './DataGrid/GeneralDataGrid';
const GeneralDataGrid = lazy(() => import('./DataGrid/GeneralDataGrid'));

export { PasswordReset, ProtectedRoute, Appbar, GeneralDataGrid, CustomAlert, PromptForSWUpdate, PromptForAppInstall };