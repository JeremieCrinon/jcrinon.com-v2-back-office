import Dashboard from './pages/Dashboard/Dashboard';

const routes = [
    { path: '/', name: 'dashboard', element: <Dashboard /> },
    // { path: '/projects', name: 'projects', element: <ReadDeleteProject /> }, //This route is in App;JS and Header.js cause it need parameters from App.js
    // { path: '/projects/create', name: 'projects_create', element: <CreateProject /> }, //This route is in App;JS and Header.js cause it need parameters from App.js
  ];
  
  export default routes;