import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DataFormatter from './DataFormatter'

function App() {


  return (
    <>
      <div>
        
          <img src={viteLogo} className="logo" alt="Vite logo" />


          <img src={reactLogo} className="logo react" alt="React logo" />

      </div>
      <DataFormatter/>
    </>
  )
}

export default App
