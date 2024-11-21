import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useContext } from "react";
import Cart from "./Cart";

export default function Checkout() {

    const { items, total } = useContext(CartContext);

    const Quantity = items.length;

    return (
        <section className="checkout">
            <h2>Checkout</h2>

{/* id para css */}

            <div className="cart-checkout" >
                {Quantity > 0 ? (
                    items.map((product) => (
                        <div classNname="cart-item" key={product.id}>
                            <Cart {...product} />
                        </div>
                    ))
                ) : (
                    <p> No items in cart!</p>
                )}
            </div>
            <h1>Cart Total: R$ {total}</h1>

            <Link to="/" className="product-actions">
                <button>RETURN</button>
            </Link>
        </section>
    );
}