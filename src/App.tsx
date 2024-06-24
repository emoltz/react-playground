import './App.css'
import { testFunction } from './lib/utils'

function App() {

  return (
    <>
      <button
        onClick={testFunction}

      >
        Click me!
      </button>

    </>
  )
}

export default App
