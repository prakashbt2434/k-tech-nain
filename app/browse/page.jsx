"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useTranslation } from "../../lib/useTranslation";

export default function BrowsePage() {
  const { t } = useTranslation();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    "All",
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Spices",
    "Others",
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const productsList = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const productData = { id: docSnapshot.id, ...docSnapshot.data() };

            // Fetch farmer data to get verification status
            if (productData.farmerId) {
              try {
                const farmerDoc = await getDoc(
                  doc(db, "users", productData.farmerId)
                );
                if (farmerDoc.exists()) {
                  productData.farmerVerified =
                    farmerDoc.data().isVerified || false;
                }
              } catch (err) {
                // If farmer fetch fails, continue without verification status
                productData.farmerVerified = false;
              }
            }

            return productData;
          })
        );
        setAllProducts(productsList);
        setFilteredProducts(productsList);
      } catch (err) {
        // Check if error is due to offline/connectivity
        if (err?.message?.includes("offline")) {
          setError(
            t("errors.firebaseOffline")
          );
        } else {
          setError(err?.message || t("browse.fetchFailed"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting whenever inputs change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    let filtered = [...allProducts];

    // Filter out sold products (buyers should only see available products)
    filtered = filtered.filter(
      (product) => (product.status || "available") === "available"
    );

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.cropName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    if (minPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => parseFloat(product.price) <= parseFloat(maxPrice)
      );
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.cropName.localeCompare(b.cropName));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, minPrice, maxPrice, sortBy, allProducts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>
          {t("browse.loadingProducts")}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "40px 20px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "var(--color-text-primary)",
          marginBottom: 8,
        }}
      >
        {t("browse.title")}
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 24,
        }}
      >
        {t(
          filteredProducts.length === 1 ? "browse.countOne" : "browse.countMany",
          { count: filteredProducts.length }
        )}
      </p>

      {error && (
        <div style={{ color: "#B91C1C", marginBottom: 20 }}>{error}</div>
      )}

      {/* Filters and Sorting */}
      <div
        style={{
          background: "var(--color-white)",
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {/* Search */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--color-text-primary)",
              }}
            >
              {t("browse.search")}
            </label>
            <input
              type="text"
              placeholder={t("browse.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--color-text-primary)",
              }}
            >
              {t("browse.category")}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={inputStyle}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`categories.${cat}`)}
                </option>
              ))}
            </select>
          </div>
          {/* 
          {/* Min Price */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--color-text-primary)",
              }}
            >
              {t("browse.minPrice")}
            </label>
            <input
              type="number"
              placeholder={t("browse.min")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={inputStyle}
            />
          </div>
          {/* Max Price */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--color-text-primary)",
              }}
            >
              {t("browse.maxPrice")}
            </label>
            <input
              type="number"
              placeholder={t("browse.max")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={inputStyle}
            />
          </div>
          {/* Sort By */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 6,
                color: "var(--color-text-primary)",
              }}
            >
              {t("browse.sortBy")}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={inputStyle}
            >
              <option value="newest">{t("browse.sortNewest")}</option>
              <option value="price-low">{t("browse.sortPriceLow")}</option>
              <option value="price-high">{t("browse.sortPriceHigh")}</option>
              <option value="name">{t("browse.sortName")}</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p
          style={{ color: "var(--color-text-secondary)", textAlign: "center" }}
        >
          {t("browse.noMatch")}
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
              marginBottom: 32,
            }}
          >
            {currentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                style={{ textDecoration: "none" }}
              >
                <div style={cardStyle}>
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.cropName}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 200,
                        background: "var(--color-bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 48,
                          color: "var(--color-primary)",
                        }}
                      >
                        🌾
                      </span>
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 600,
                          color: "var(--color-text-primary)",
                          margin: 0,
                        }}
                      >
                        {product.cropName}
                      </h3>
                      {(product.status || "available") === "sold" && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "#FEE2E2",
                            color: "#991B1B",
                          }}
                        >
                          {t("browse.sold")}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {product.category && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "#EFF6FF",
                            color: "#1E40AF",
                          }}
                        >
                          {t(`categories.${product.category}`, {
                            defaultValue: product.category,
                          })}
                        </span>
                      )}
                      {product.farmerVerified && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "#D1FAE5",
                            color: "#065F46",
                          }}
                        >
                          {t("browse.verified")}
                        </span>
                      )}
                    </div>
                    {false && product.farmerVerified && (
                      <div style={{ marginBottom: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "#D1FAE5",
                            color: "#065F46",
                          }}
                        >
                          {t("browse.verifiedFarmer")}
                        </span>
                      </div>
                    )}
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 500,
                        color: "var(--color-primary)",
                        marginBottom: 8,
                        margin: 0,
                      }}
                    >
                      {t("browse.pricePerKg", {
                        price: parseFloat(product.price).toFixed(2),
                      })}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--color-text-secondary)",
                        margin: 0,
                      }}
                    >
                      {t("browse.availableQty", { quantity: product.quantity })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                marginTop: 32,
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                {t("browse.previous")}
              </button>

              <span
                style={{
                  fontSize: 14,
                  color: "var(--color-text-primary)",
                }}
              >
                {t("browse.pageOf", { current: currentPage, total: totalPages })}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  ...paginationButtonStyle,
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                {t("browse.next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const cardStyle = {
  background: "var(--color-white)",
  borderRadius: 8,
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  overflow: "hidden",
  cursor: "pointer",
  transition: "box-shadow 0.2s ease",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #E5E7EB",
  borderRadius: 6,
  fontSize: 16,
  color: "var(--color-text-primary)",
  minHeight: 44,
};

const paginationButtonStyle = {
  padding: "12px 20px",
  background: "var(--color-primary)",
  color: "var(--color-white)",
  border: "none",
  borderRadius: 6,
  fontSize: 16,
  fontWeight: 500,
  minHeight: 44,
  cursor: "pointer",
};
