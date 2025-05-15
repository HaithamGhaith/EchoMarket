import { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
  GlobalStyles,
} from "@mui/material";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import VoiceCommands from "./components/VoiceCommands";
import SignIn from "./components/SignIn";
import Checkout from "./components/Checkout";
import { motion, AnimatePresence } from "framer-motion";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7dd3fc", // shadcn blue
    },
    secondary: {
      main: "#f472b6", // shadcn pink
    },
    background: {
      default: "#0f172a",
      paper: "rgba(17, 24, 39, 0.85)",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeightBold: 700,
    h4: { fontWeight: 700, letterSpacing: 0.5 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "rgba(17, 24, 39, 0.85)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          borderRadius: 18,
          backdropFilter: "blur(8px)",
          border: "1.5px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #1e293b 0%, #334155 100%)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          borderRadius: 18,
          border: "1.5px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          letterSpacing: 0.5,
          boxShadow: "0 2px 8px 0 rgba(31,38,135,0.10)",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          background: "rgba(17, 24, 39, 0.75)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
          padding: "2rem",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "rgba(17, 24, 39, 0.65)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "rgba(30,32,38,0.85)",
        },
      },
    },
  },
});

function App() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState("signin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCart.filter((item) => item.id !== productId);
      }
    });
  };

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    setCurrentPage("products");
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("signin");
    localStorage.removeItem("user");
  };

  // Voice feedback for checkout
  const speakCartSummary = () => {
    if (window.speechSynthesis && cart.length > 0) {
      let summary = "You have the following items in your cart: ";
      let total = 0;
      cart.forEach((item) => {
        summary += `${item.quantity} ${item.name} at $${item.price} each. `;
        total += item.price * item.quantity;
      });
      summary += `The total price is $${total.toFixed(2)}.`;
      const utter = new window.SpeechSynthesisUtterance(summary);
      utter.lang = "en-US";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background: "linear-gradient(120deg, #0f172a 0%, #334155 100%)",
          },
        }}
      />
      {isAuthenticated && (
        <>
          <VoiceCommands
            setCurrentPage={setCurrentPage}
            addToCart={addToCart}
            cart={cart}
          />
          <Navbar
            cart={cart}
            setCurrentPage={setCurrentPage}
            onLogout={handleLogout}
          />
        </>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === "signin" && !isAuthenticated && (
            <SignIn onLogin={handleLogin} />
          )}
          {currentPage === "products" && isAuthenticated && (
            <ProductList addToCart={addToCart} />
          )}
          {currentPage === "cart" && isAuthenticated && (
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              setCurrentPage={setCurrentPage}
            />
          )}
          {currentPage === "checkout" && isAuthenticated && (
            <Checkout cart={cart} speakCartSummary={speakCartSummary} />
          )}
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
