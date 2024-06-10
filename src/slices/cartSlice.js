import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    totalItems : localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        totalItems: (state,value) => {
            state.totalItems = value.payload;
        },

        //add to cart
        add: (state, value) => {
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            cart.push(value.payload);
            state.totalItems = cart.length;
            localStorage.setItem('cart', JSON.stringify(cart));
        },

        //remove to cart
        remove: (state, action) => {
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
            cart = cart.filter(item => item.id !== action.payload);
            state.totalItems = cart.length;
            localStorage.setItem('cart', JSON.stringify(cart));
        },
    
        //reset cart
        resetCart : (state, action) => {
            state.totalItems = 0;
            localStorage.setItem('cart', JSON.stringify([]));
        }
    }
})

export const { totalItems, add, remove, resetCart } = cartSlice.actions;
export default cartSlice.reducer;