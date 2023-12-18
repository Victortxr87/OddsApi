import React from 'react'
import ReactDOM from 'react-dom/client'
import OddsTips from './Components/OddsTips/OddsTips.jsx'
import ResultsComponent from './Components/ResultsComponent/ResultsComponent.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OddsTips/>
    <ResultsComponent />
  </React.StrictMode>,
)
