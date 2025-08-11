// import './App.css'
// import Navbar from './Components/Navbar/Navbar'
// import { Outlet } from 'react-router-dom'

// function App() {
//   // set theme of app after checking the state from localstorage:
//   if (localStorage.getItem("isDarkMode") === "false") {
//     // set light mode
//     document.body.parentElement.setAttribute("data-theme","cupcake")
//   }
//   // else do nothing as dark mode is enabled by default
  
//   return (
//     <>
//       <Navbar />
//       <Outlet/>
//     </>
//   )
// }

// export default App


import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Aside from './Components/Aside/Aside'
import { Outlet } from 'react-router-dom'

function App() {
  if (localStorage.getItem("isDarkMode") === "false") {
    document.body.parentElement.setAttribute("data-theme","cupcake")
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="sidebar_drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Navbar />
        <main className='p-4 flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar_drawer" className="drawer-overlay"></label>
        <Aside />
      </div>
    </div>
  )
}

export default App
