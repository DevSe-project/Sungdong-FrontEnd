import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Detail } from './component/Detail';
import { useState } from 'react';
import { DataObj } from './component/DataObj'
import { List } from './component/List';
function App() {
  const navigate = useNavigate();
  const [data, setData] = useState(DataObj);
  return (
    <div className="App">
      <List data={data}/>
      <Routes>
        <Route path="/list" element={
          <List data={data} navigate={navigate}/>
        }/>
        <Route path="/detail/:id" element={
          <Detail data={data} navigate={navigate}/>
        }/>
      </Routes>
    </div>
  );
}

export default App;
