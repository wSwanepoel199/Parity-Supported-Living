# Parity Supported Living Notes

A React.js web application build with create-react-app for creating and maintaining case notes for Parity Supported Living Pty Lmt.

## Running PSL Notes

Clone the [PSL Notes](https://github.com/wSwanepoel199/Parity-Supported-Living) repo.

Ensure node has been installed by running the following command in a console/terminal.

```bash
node --version
```

navigate into the cloned repo and run

```bash
npm i
```

Once installed create a .env file using

```bash
touch .env
```

Once the .env file is created open in and define the following values

```text
REACT_APP_API_URL: the url for your backend
PUBLIC_PATH: the default path for all application assets
PUBLIC_URL: the default publicly available url.
```

Once these values have been defined in your .env you can follow either the Default React or Custom Webpack paths to start the application.

### Default React

To run the dev server use

```bash
npm run dev
```

To build the application run

```bash
npm run build
```

To start the production server using the built application run

```bash
npm run start
```

## Usage

PSL Notes is designed to be used with the [psl-notes-backend](https://github.com/wSwanepoel199/-Parity-Supported-Living-Backend). Make sure both are running.

PSL Notes allows a user to sign in with pre-provided sign in details, once signed in a user can create and view case notes created by themselves. They will also be able to view their assigned clients including any details relevant to the clients care.

If a user in an Admin or Coordinator they will also be able to edit and delete created notes while also being able to view all created notes regardless of their author. As an admin a user is able to create new users and clients or edit and delete existing users or clients.

## Technologies Used

For easy user interface development and management [Material UI](https://mui.com/) and its dependencies where used, including [Emotion](https://emotion.sh/docs/introduction). [Axios](https://axios-http.com/) is used for more control over backend API calls and [Redux Toolkit](https://redux-toolkit.js.org/) for application state management. [React-Router](https://reactrouter.com/en/main) is used for in application routing and [SheetJS](https://docs.sheetjs.com/) to allow for excel document processing to upload data to the backend. [React-Phone-Input-2](https://github.com/bl00mber/react-phone-input-2) is used for easier mobile inputs and [Date-FNS](https://date-fns.org/) is used to farmat ISO datetime values to more readable altenratives. [Tailwindcss](https://tailwindcss.com/) is implimented for easy styling of various components inorder to override default styling provided by Material UI.

[Workbox](https://developer.chrome.com/docs/workbox/) is used to create and maintain a service worker for offline use and to allow the application to be installed on mobile devices as a PWA. [Dotenv](https://github.com/motdotla/dotenv) and [Express](https://expressjs.com/) are used to run a script to serve the application and redirect any not http requests to https, as well as to convert any ".js" requests to the compressed ".js.gz" file.

## Custom Features

### Custom Tailwindcss Classes

text-fill; a custom tailwindcss class has been implimented inorder to override Material UI's disbaled styling by allowing for the use of webkits text-fill function. The custom class is compatable with all tailwind's configured colours.

## Contributions

Contributions and suggestions welcome.
