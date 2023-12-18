import React from 'react';
import './App.css'; // Đường dẫn đến tệp CSS của bạn

import ChessBoard from "./components/ChessBoard/ChessBoard";

function App() {
  return (
    <div id="app">
      <ChessBoard />
    </div>
  );
}

export default App;
