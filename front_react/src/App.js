import './App.css';
import LeftDrawer from './pages/components/Drawer';
import Routing from "./Routing";

function App() {
  return (

    <div className="App">
      <LeftDrawer />
      <div className="Content">
        <Routing />
      </div>
    </div>
  );
}

export default App;
