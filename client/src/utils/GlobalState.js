import { reducer } from "./reducers";
import { createStore } from "redux";

const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: ''
}

const store = createStore(reducer, initialState);

export default store;
