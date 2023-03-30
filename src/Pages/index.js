import { lazy } from "react";

// import Landing from "./Landing/Landing";
const Landing = lazy(() => import('./Landing/Landing'));
// import SignIn from "./SignIn/SignIn";
const SignIn = lazy(() => import('./SignIn/SignIn'));
// import Users from './User/Users';
const Users = lazy(() => import('./User/Users'));
// import Posts from './Post/Posts';
const Posts = lazy(() => import('./Post/Posts'));
// import Clients from './Client/Clients';
const Clients = lazy(() => import('./Client/Clients'));
// import Roster from "./Roster/Roster";
const Roster = lazy(() => import('./Roster/Roster'));

export { Landing, SignIn, Users, Posts, Clients, Roster };