import React, { useEffect, useRef, useState, useMemo } from "react";

const Watchlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const heightRef = useRef({});
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  function handleChange(e) {
    setInput(e.target.value);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(input);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [input]);
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return product.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [products, debouncedSearch]);
  function handleScroll(e) {
    setScrollTop(e.target.scrollTop);
  }
  useEffect(() => {
    let total = 0;
    const newPosition = [];

    for (let i = 0; i < filteredProducts.length; i++) {
      const item = filteredProducts[i];

      newPosition.push(total);

      const currentHeight = heightRef.current[item.id] || 400;

      total += currentHeight;
    }

    setPositions(newPosition);
  }, [filteredProducts]);

  function findStartIndex(scrollTop, positions) {
    let low = 0;
    let high = positions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      const current = positions[mid];
      const next = positions[mid + 1] || Infinity;

      if (current <= scrollTop && next > scrollTop) {
        return mid;
      }

      if (current > scrollTop) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return 0;
  }
  const startIndex = findStartIndex(scrollTop, positions);
  const containerheight = 700;
  const viewportEnd = scrollTop + containerheight;
  let endIndex = startIndex;
  while (endIndex < positions.length && positions[endIndex] < viewportEnd) {
    endIndex++;
  }
  const buffer = 3;
  const visibleItems = filteredProducts.slice(startIndex, endIndex + buffer);

  const totalHeight =
    positions.length > 0 ? positions[positions.length - 1] + 400 : 0;

  return (
    <div>
      <div className="inputList">
        <input
          type="text"
          placeholder="search"
          value={input}
          onChange={handleChange}
        />
      </div>
      <div
        className="ListContainer"
        onScroll={handleScroll}
        style={{
          height: "700px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            height: `${totalHeight}px`,
          }}
        >
          <div
            style={{
              transform: `translateY(
          ${positions[startIndex] || 0}px
        )`,
            }}
          >
            {visibleItems.map((product) => (
              <div
                key={product.id}
                className="product-card"
                ref={(element) => {
                  if (element) {
                    heightRef.current[product.id] = element.offsetHeight;
                  }
                }}
              >
                <h2>{product.title}</h2>
                <p>Price: ${product.price}</p>
                <p>Rating: {product.rating}</p>
                <p>Stock: {product.stock}</p>

                <img src={product.thumbnail} alt={product.title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
