import { createContext, useState, useEffect, useReducer } from "react";

export const CartContext = createContext({
    items: [],
    products: [],
    loading: false,
    error: "",
    total: 0,
    addItemToCart: () => { },
    updateItemQuantity: () => { },
    subItemToCart: () => { }


});

export default function CartContextProvider({ children }) {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);




    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const response = await fetch("https://dummyjson.com/products/category/fragrances?limit=12&select=id,thumbnail,title,price,description");
            if (response.ok) {
                const result = await response.json();
                setProducts(result.products);
            } else {
                setError("Fetch FAILED!");
            }
            setLoading(false);
        }

        fetchProducts();
    }, []);

    // SHOPPING CART

    

    function cartReducer(state, action) {

        if (action.type === "ADD_ITEM") {
            const updatedItems = [...state.items];

            const existingCartItemIndex = updatedItems.findIndex(
                (item) => item.id === action.payload.id
            );

            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                }
                updatedItems[existingCartItemIndex] = updatedItem;
                setTotal((prevTotal) => prevTotal + existingCartItem.price);
            }
            
            else {
                const product = action.payload.products.find(
                    (product) => product.id === action.payload.id
                );
                updatedItems.push({
                    id: action.payload.id,
                    thumbnail: product.thumbnail,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    
                });
                setTotal((prevTotal) => prevTotal + product.price);
            }

            return { items: updatedItems };
        }

        if (action.type === "SUB_ITEM") {
            const updatedItems = [...state.items];

            const existingCartItemIndex = updatedItems.findIndex(
                (item) => item.id === action.payload.id
            );

            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity - 1,
                }
                updatedItems[existingCartItemIndex] = updatedItem;

                if (updatedItem.quantity < 1) {
                    updatedItems.splice(existingCartItemIndex, 1);
                } else {
                    updatedItems[existingCartItemIndex] = updatedItem;
                }

                setTotal((prevTotal) => prevTotal - existingCartItem.price);
            }

            return { items: updatedItems };
        }

        if (action.type === "UPDATE_ITEM") {
            const updatedItems = [...state.items];

            const updatedItemIndex = updatedItems.findIndex(
                (item) => item.id === action.payload.id
            );

            const updatedItem = { ...updatedItems[updatedItemIndex] };

            updatedItem.quantity += action.payload.amount;

            if (updatedItem.quantity < 1) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }

            return { ...state, items: updatedItems };
        }

        return state;
    }

    const [cartState, cartDispatch] = useReducer(
        cartReducer,
        { items: [] }
    );

    function handleAddItemToCart(id) {
        cartDispatch({
            type: "ADD_ITEM",
            payload: { id, products }
        });
    }

    function handleUpdateCartItemQuantity(id, amount) {
        cartDispatch({
            type: "UPDATE_ITEM",
            payload: { id, amount }
        });
    }

    function handleSubItemToCart(id) {
        cartDispatch({
            type: "SUB_ITEM",
            payload: { id, products }
        });
    }

    const ctx = {
        items: cartState.items,
        products: products,
        loading: loading,
        error: error,
        total: Math.abs(total.toFixed(2)),
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
        subItemToCart: handleSubItemToCart
    };

    return <CartContext.Provider value={ctx}>
        {children}
    </CartContext.Provider>

}