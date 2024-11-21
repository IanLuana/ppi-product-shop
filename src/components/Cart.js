import { CartContext } from "../context/CartContext";
import { useContext } from "react";

export default function Cart({ id, thumbnail, title, price, quantity }) {

    const { addItemToCart, subItemToCart } = useContext(CartContext);

    return (
        <div className="cart-body">
            <img src={thumbnail} alt={thumbnail} className="img-cart" />
            <h2>{title}</h2>
            <p>R$ {price}</p>
            <div className="button-group">
                <button onClick={() => subItemToCart(id)}>-</button>
                <h2>{quantity}</h2>
                <button onClick={() => addItemToCart(id)}>+</button>
            </div>
        </div>
    );
}