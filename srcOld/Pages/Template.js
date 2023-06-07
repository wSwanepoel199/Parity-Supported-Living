import logo from "../logo.svg";

const Template = () => {

  return (
    <div className="text-center">
      <header className=" bg-slate-900 min-h-screen flex flex-col items-center justify-center text-[calc(10px+2vmin)] text-white">
        <img src={logo} className="h-[40vmin] pointer-events-none [@media(prefers-reduced-motion:no-preference)]:animate-[spin_20s_linear_infinite]" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="text-blue-300"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default Template;