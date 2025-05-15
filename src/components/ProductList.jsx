import { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { products, categories } from "../assets/products";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const gridVariants = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 15 },
  },
};

const ProductList = ({ addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <Tab label="All Products" value="all" />
          {categories.map((category) => (
            <Tab key={category.id} label={category.name} value={category.id} />
          ))}
        </Tabs>
      </Box>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.035,
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
            }}
            style={{ height: "100%" }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                background: "rgba(30,32,38,0.85)",
                boxShadow: "0 4px 24px 0 rgba(31,38,135,0.10)",
                transition: "box-shadow 0.3s, transform 0.3s",
                "&:hover": {
                  boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{
                  transition: "transform 0.3s",
                  objectFit: "cover",
                }}
              />
              <Chip
                label={
                  categories.find((cat) => cat.id === product.category)?.name
                }
                size="small"
                color="primary"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "rgba(33, 150, 243, 0.9)",
                }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  ${product.price}
                </Typography>
                <Typography
                  variant="body2"
                  color={product.stock < 5 ? "error.main" : "text.secondary"}
                  sx={{ mb: 2 }}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : `${product.stock} units left`}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  sx={{
                    mt: "auto",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
};

export default ProductList;
