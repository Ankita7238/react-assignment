import "./App.css";
import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    // Load products from localStorage on initial render
    const loadedProducts = [];
    let initialNetWorth = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const product = JSON.parse(localStorage.getItem(key));
        if (product && product.localId) {
          loadedProducts.push(product);
          initialNetWorth += Number(product.price);
        }
      } catch (error) {
        console.error("Error in fetching product from localStorage", error);
      }
    }

    setProducts(loadedProducts);
    setNetWorth(initialNetWorth);
  }, []);

  const addProduct = () => {
    const newProduct = { id: productId, name: productName, price: sellingPrice };
    const newId = products.length ? Math.max(products.map(p => p.localId)) + 1 : 1;
    const newProductWithId = { ...newProduct, localId: newId };
    const updatedNetWorth = netWorth + Number(sellingPrice);

    // Save to local storage
    localStorage.setItem(newId, JSON.stringify(newProductWithId));

    // Update state
    setProducts([...products, newProductWithId]);
    setNetWorth(updatedNetWorth);
    setProductId('');
    setProductName('');
    setSellingPrice('');
  };

  const deleteProduct = (localId) => {
    // Find and remove the product
    const productToDelete = products.find(product => product.localId === localId);
    const updatedNetWorth = netWorth - Number(productToDelete.price);

    // Remove from local storage
    localStorage.removeItem(localId);

    // Update state
    const updatedProducts = products.filter(product => product.localId !== localId);
    setProducts(updatedProducts);
    setNetWorth(updatedNetWorth);
  };

  return (
    <>
      <h3>Product Form</h3>
      <form onSubmit={(e) => { e.preventDefault() }}>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
        />
        <button onClick={addProduct}>Add Product</button>
      </form>
      {
        (products.length > 0) ?
          <>
            <h3>Products List</h3>
            <ul>
              {products.map((product) => (
                <li key={product.localId}>
                  {product.id} - {product.name} - Rs.{product.price}
                  <button onClick={() => deleteProduct(product.localId)}>Delete Product</button>
                </li>
              ))}
            </ul>
            <p>Total Worth of Products: {netWorth}</p>
          </>
          : <p>List is empty. Add Some Products to the list.</p>
      }
    </>
  );
};

export default App;
