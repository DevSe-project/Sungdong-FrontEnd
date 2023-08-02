import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Detail } from './component/Detail';

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/detail" element={
          <Detail navigate={navigate}/>
        }/>
      </Routes>
    </div>
  );
}

export default App;
