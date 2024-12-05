import { useContext, useRef, useState, useEffect } from "react";
import Product from "./Product";
import { CircularProgress } from "@mui/material";
import { CartContext } from "../context/CartContext";
import styles from "./Shop.module.css";

export default function Shop() {

    const { products, loading, error } = useContext(CartContext);

    const searchInput = useRef("");
    const [filteredItems, setFilteredItems] = useState([]);

    useEffect(() => {
        if(products) {
            setFilteredItems(products);
        }
    }, [products]);

    function handleSearch() {
        const term = searchInput.current.valueOf.toLowerCase();
        setFilteredItems(
            products.filter((item) => item.title.toLowerCase().includes(term))
        );
    }

    function clearSearch() {
        searchInput.current.value = "";
        setFilteredItems(products);
    }

    return (
        <section id="shop">
            <h2>Elegant Products for Everyone</h2>

            <div className={styles.search_container}>
                <div className={styles.search_box}>
                    <input 
                    ref={searchInput}
                    className={styles.search_input}
                    type="text"
                    placeholder="Type to search..."
                    onChange={handleSearch}
                    />
                    <button className={styles.search_clear} onClick={clearSearch}>CLEAR</button>
                </div>
            </div>

            <ul id="products">
                {error && <p>{error}</p>}
                {loading &&
                    <div id="loading">
                        <CircularProgress size="10rem" color="inherit" />
                        <p>Loading products...</p>
                    </div>
                }
                {!loading && !error && filteredItems.length > 0 ? (
                    filteredItems.map((product) => (
                        <li key={product.id}>
                            <Product {...product} />
                        </li>
                    ))
                ) : (
                    <p>Not Found!</p>
                )}
            </ul>

        </section>
    );
}