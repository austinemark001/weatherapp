import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Tools';
import Home from './components/Home';
import City from './components/City';
import FavoritesWeather from './components/Favorites';
import About from './components/About';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" exact Component={Home}  />
        <Route path="/city/:city" Component={City} />
        <Route path="/favorites" Component={FavoritesWeather} />
        <Route path="/about" Component={About} />
      </Routes>
    </>
  );
}

export default App;
