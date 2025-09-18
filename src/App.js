import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import Expensetrack from './components/Expensetrack';

function App() {
 
  return (
    <div className='con'>
    <Expensetrack/>
    </div>
  );
}

export default App;
