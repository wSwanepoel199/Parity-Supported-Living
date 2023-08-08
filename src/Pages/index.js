import { lazy } from "react";

// import Landing from "./Landing/Landing";
import SignIn from "./SignIn/SignIn";
// import Users from './User/Users';
// import Posts from './Post/Posts';
// import Clients from './Client/Clients';

const Landing = lazy(() => import('./Landing/Landing'));
// const SignIn = lazy(() => import('./SignIn/SignIn'));
const Users = lazy(() => import('./User/Users'));
const Notes = lazy(() => import('./Note/Notes'));
const Clients = lazy(() => import('./Client/Clients'));

export { Landing, SignIn, Users, Notes, Clients };