import React from 'react';
import { Route, Routes } from "react-router-dom";
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);

  React.useEffect(() => {
    axios.get('https://645d1f34250a246ae3182e56.mockapi.io/items').then((res) => {
      setItems(res.data);
    });
    // axios.get('https://645d1f34250a246ae3182e56.mockapi.io/cart').then((res) => {
    //   setCartItems(res.data);
    // });
    axios.get('https://645d1f34250a246ae3182e56.mockapi.io/favorites').then((res) => {
      setFavorites(res.data);
    });
  }, []);

  const onAddToCart = (obj) => {
    axios.post('https://645d1f34250a246ae3182e56.mockapi.io/cart', obj);
    setCartItems(prev => [...prev, obj]);
  }

  const onRemoveItem = (id) => {
    axios.delete(`https://645d1f34250a246ae3182e56.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`https://645d1f34250a246ae3182e56.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post('https://645d1f34250a246ae3182e56.mockapi.io/favorites/', obj)
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  return (
    <div className="wrapper clear">
      
      {cartOpened && <Drawer items={cartItems} onCloseCart={() => setCartOpened(false)} onRemove={onRemoveItem} />}

      <Header onClickCart={() => setCartOpened(true)} />

      <Routes>
        <Route
          path="/"
          element={
            <Home 
              items={items} 
              searchValue={searchValue} 
              setSearchValue={setSearchValue} 
              onChangeSearchInput={onChangeSearchInput} 
              onAddToFavorite={onAddToFavorite} 
              onAddToCart={onAddToCart} 
            />
          }
          exact
        />

        <Route
          path="/favorites"
          element={
            <Favorites 
              items={favorites} 
              onAddToFavorite={onAddToFavorite} 
              onAddToCart={onAddToCart} 
            />
          }
          exact
        />
      </Routes>

    </div>
  );
}

export default App;
