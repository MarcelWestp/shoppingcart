import React, { useState, useEffect } from "react";
import CartTable from "./CartTable";
import AddItem from "./AddItem";

function CartBody() {
  const PRODUCT_URL = `${process.env.REACT_APP_API_URL}/api/products`;
  const CART_URL = `${process.env.REACT_APP_API_URL}/api/items`;

  const [products, setProducts] = useState([]);
  const [productsIsLoading, setProductsIsLoading] = useState(true);
  const [cartList, setCartList] = useState([]);
  const [cartListIsLoading, setCartListIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    setTimeout(() =>{
      fetchFunction(PRODUCT_URL, setProducts,setProductsIsLoading);
      fetchFunction(CART_URL, setCartList,setCartListIsLoading);
    },2000)
  }, []);

  const fetchFunction = async (url, setFunc,setLoad) => {
    try {
      setLoad(true)
      const response = await fetch(url);
      if (!response.ok) throw Error("Did not received expected data");
      const listProducts = await response.json();
      setFunc(listProducts);
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message);
    }finally{
      setLoad(false);
    }
  };

const createItem = async (item) => {
    const response = await fetch(CART_URL, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const cartItem = await response.json()
    setCartList(prevState => [...prevState,cartItem])
  }

  const setPrice = () => cartList.map( item => products.find(p => p.id === item.product_id).priceInCents * item.quantity).reduce((acc, prev) => acc + prev,0)/100;


  return (
    <div>
      <h2>AWESOME PRODUCTS!</h2>
      {(productsIsLoading || cartListIsLoading) && <h4>is loading...</h4>}
      {!productsIsLoading && !cartListIsLoading && <CartTable cartList={cartList} products={products} />}
      {!productsIsLoading && !cartListIsLoading && <h4>Total Price: ${setPrice()}</h4>}
      {!productsIsLoading && !cartListIsLoading && <AddItem products={products} nextID={cartList.length + 1} createItem={createItem} />}
    </div>
  );
}

export default CartBody;
