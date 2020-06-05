import React from 'react';
import logo from './logo.svg';
import './App.css';
import BubbleComp from './components/Bubble';
import BarChart from './components/BarChart';
import PolarChart from './components/PolarChart';
import ScatterChart from './components/ScatterChart';
import { Scatter } from 'react-chartjs-2';

function App() {
  return (
    <div className="App">
      <BubbleComp/>
      <ScatterChart/>
      <BarChart/>
      <PolarChart/>
    </div>
  );
}

export default App;
