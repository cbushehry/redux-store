import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';

import { UPDATE_PRODUCTS } from '../../utils/actions';

import { useSelector, useDispatch } from 'react-redux';

import { idbPromise } from "../../utils/helpers";

function ProductList() {
  // make dispatch const from useDispatch
  const dispatch = useDispatch();
  // select currentCategory and products from state
  const currentCategory = useSelector(state => state.currentCategory);
  const products = useSelector(state => state.products);

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    // if there's data to be stored
    if (data) {
      // store it in the global state object
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      // take each product and save it to indexedDB using the helper function
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // add else if to check if 'loading' us undefuned in `useQuery()` hook
    } else if (!loading) {
      // if offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return products;
    }

    return products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
