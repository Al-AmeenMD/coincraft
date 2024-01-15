import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CoinList } from './config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext()

const CryptoContext = ({children}) => {

  const [currency, setCurrency] = useState("NGN");
  const [symbol, setSymbol] = useState("N")
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if(user) {
      const coinRef = doc(db, "watchlist", user.uid);
//check if database is updated or not
      var unsubscribe = onSnapshot(coinRef, coin => {
        if(coin.exists()){
          setWatchlist(coin.data().coins);
        } else {
          console.log("No items found in Watchlist");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user])


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    })
  })

    const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    console.log(data);

    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    if(currency === "NGN") setSymbol("N");
    else if (currency === "USD") setSymbol("$");
    
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [currency]);

  return (
    <Crypto.Provider value={{currency, symbol, setCurrency, coins, loading, fetchCoins, alert, setAlert, user, watchlist}}>
        {children}
    </Crypto.Provider>
  )
}

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
}