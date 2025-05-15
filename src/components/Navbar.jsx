import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  Box,
  Paper,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import { motion } from "framer-motion";

const Navbar = ({ cart, setCurrentPage, onLogout }) => {
  const username = localStorage.getItem("user");

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 0,
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: "linear-gradient(90deg, #0ea5e9 0%, #7dd3fc 100%)",
        minHeight: 80,
        boxShadow: "0 4px 24px 0 rgba(31, 38, 135, 0.10)",
        borderBottom: "2px solid rgba(255,255,255,0.08)",
        mb: 3,
        px: 0,
      }}
    >
      <Toolbar sx={{ minHeight: 80, px: 3 }}>
        <Typography
          variant="h5"
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
            textShadow: "0 2px 8px rgba(14,165,233,0.12)",
          }}
          onClick={() => setCurrentPage("products")}
        >
          EchoMarket
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body1"
            sx={{ color: "#e0f2fe", fontWeight: 500 }}
          >
            Welcome, {username}
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setCurrentPage("cart")}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            sx={{ color: "#fff" }}
          >
            <Badge badgeContent={cart.length} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Button
            color="inherit"
            onClick={onLogout}
            startIcon={<LogoutIcon />}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 2px 8px 0 rgba(14,165,233,0.10)",
              "&:hover": {
                background: "rgba(255,255,255,0.18)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </Paper>
  );
};

export default Navbar;
