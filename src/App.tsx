import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { Main } from './layout/Main';

import './App.css';


function App() {
  return (
    <div className="screen">
      <Main></Main>
    </div>
  );
}

export default App;
