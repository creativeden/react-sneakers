import React from 'react';
import { Route, Routes } from "react-router-dom";
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [ itemsResponse, cartResponse, favoritesResponse ] = await Promise.all([
          axios.get('http://localhost:3001/items'),
          axios.get('http://localhost:3001/cart'), 
          axios.get('http://localhost:3001/favorites')
        ]);

        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('Ошибка при запросе данных');
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        setCartItems(prev => prev.filter(item => Number(item.id) !== Number(obj.id)));
        await axios.delete(`http://localhost:3001/cart/${obj.id}`);
      } else {
        setCartItems(prev => [...prev, obj]);
        await axios.post('http://localhost:3001/cart', obj);
      }
    } catch (error) {
      console('Не удалось добавить в корзину');
      console.log(error);
    }
  }

  const onRemoveItem = (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      axios.delete(`http://localhost:3001/cart/${id}`);
    } catch (error) {
      console('Не удалось удалить из корзины');
      console.log(error);
    }
  }

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(`http://localhost:3001/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
        
      } else {
        const { data } = await axios.post('http://localhost:3001/favorites/', obj)
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты');
      console.log(error);
    }
  }

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  }

  const isItemAdded = (id) => {
    return cartItems.some(obj => Number(obj.id) === Number(id));
  }

  return (
    <AppContext.Provider 
      value={{ 
        items, 
        cartItems, 
        favorites, 
        isItemAdded, 
        onAddToFavorite, 
        onAddToCart, 
        setCartOpened, 
        setCartItems 
      }}>
      <div className="wrapper clear">
        
        <Drawer items={cartItems} onCloseCart={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />

        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <Home 
                items={items} 
                cartItems={cartItems} 
                searchValue={searchValue} 
                setSearchValue={setSearchValue} 
                onChangeSearchInput={onChangeSearchInput} 
                onAddToFavorite={onAddToFavorite} 
                onAddToCart={onAddToCart} 
                isLoading={isLoading}
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
          <Route
            path="/orders"
            element={
              <Orders
              />
            }
            exact
          />
        </Routes>

      </div>
    </AppContext.Provider>
  );
}

export default App;
