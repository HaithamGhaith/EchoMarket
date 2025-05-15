import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Paper,
  Box,
  Divider,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = ({ cart, removeFromCart, setCurrentPage }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adding some products using voice commands or the "Add to Cart"
          button
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Paper elevation={2}>
        <List>
          {cart.map((item, index) => (
            <div key={`${item.id}`}>
              <ListItem>
                <ListItemText
                  primary={item.name}
                  secondary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                />
                <Badge
                  badgeContent={item.quantity}
                  color="primary"
                  sx={{ mr: 2 }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < cart.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Total: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => setCurrentPage("checkout")}
          sx={{ mt: 2 }}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
