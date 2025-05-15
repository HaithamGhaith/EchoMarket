import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Divider,
  Button,
  TextField,
} from "@mui/material";

function randomOrderId() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
function randomDays() {
  return Math.floor(Math.random() * 5) + 2; // 2-6 days
}

const Checkout = ({ cart, speakCartSummary }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [step, setStep] = useState("summary");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const recognitionRef = useRef(null);
  const [inputText, setInputText] = useState("");

  // Helper: Speak text aloud and only listen after speaking is done
  const speak = (text, afterSpeak) => {
    // Stop recognition if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.onend = () => {
        if (afterSpeak) afterSpeak();
      };
      window.speechSynthesis.speak(utter);
    } else {
      if (afterSpeak) afterSpeak();
    }
  };

  // Helper: Start speech recognition only after speaking is done
  const listen = (prompt, cb) => {
    speak(prompt, () => {
      if ("webkitSpeechRecognition" in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript;
          cb(result);
        };
        recognitionRef.current = recognition;
        recognition.start();
      }
    });
  };

  // Step 1: Read cart summary and ask for address
  useEffect(() => {
    if (step === "summary" && cart.length > 0) {
      if (speakCartSummary) {
        // Speak summary, then move to address after speech ends
        window.speechSynthesis.cancel();
        const summary = (() => {
          let s = "You have the following items in your cart: ";
          let total = 0;
          cart.forEach((item) => {
            s += `${item.quantity} ${item.name} at $${item.price} each. `;
            total += item.price * item.quantity;
          });
          s += `The total price is $${total.toFixed(2)}.`;
          return s;
        })();
        const utter = new window.SpeechSynthesisUtterance(summary);
        utter.lang = "en-US";
        utter.onend = () => setStep("address");
        window.speechSynthesis.speak(utter);
      } else {
        setTimeout(() => setStep("address"), 3500 + cart.length * 1200);
      }
    }
    // eslint-disable-next-line
  }, [step]);

  // Step 2: Ask for address
  useEffect(() => {
    if (step === "address") {
      listen("Please say your shipping address after the beep.", (result) => {
        setAddress(result);
        setInputText(result);
        setStep("payment");
      });
    }
    // eslint-disable-next-line
  }, [step]);

  // Step 3: Ask for payment method
  useEffect(() => {
    if (step === "payment") {
      listen(
        "How would you like to pay? Say cash or credit card.",
        (result) => {
          setPayment(result);
          setInputText(result);
          setStep("confirm");
        }
      );
    }
    // eslint-disable-next-line
  }, [step]);

  // Step 4: Confirm order
  useEffect(() => {
    if (step === "confirm") {
      const days = randomDays();
      const orderId = randomOrderId();
      const confirmText = `Thank you! Your order will be shipped to ${address}. Payment method: ${payment}. Your order ID is ${orderId}. Estimated delivery: ${days} days.`;
      setConfirmation(confirmText);
      // Speak confirmation, then spell order ID
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const mainUtter = new window.SpeechSynthesisUtterance(
          `Thank you! Your order will be shipped to ${address}. Payment method: ${payment}. Your order ID is:`
        );
        mainUtter.lang = "en-US";
        mainUtter.onend = () => {
          // Spell order ID letter by letter
          const chars = orderId.split("");
          let idx = 0;
          function speakNextChar() {
            if (idx < chars.length) {
              const charUtter = new window.SpeechSynthesisUtterance(chars[idx]);
              charUtter.lang = "en-US";
              charUtter.onend = () => {
                idx++;
                setTimeout(speakNextChar, 250);
              };
              window.speechSynthesis.speak(charUtter);
            } else {
              // After order ID, say estimated delivery
              const endUtter = new window.SpeechSynthesisUtterance(
                `Estimated delivery: ${days} days.`
              );
              endUtter.lang = "en-US";
              window.speechSynthesis.speak(endUtter);
            }
          }
          speakNextChar();
        };
        window.speechSynthesis.speak(mainUtter);
      }
    }
    // eslint-disable-next-line
  }, [step]);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Paper elevation={2}>
        <List>
          {cart.map((item, index) => (
            <div key={item.id}>
              <ListItem>
                <ListItemText
                  primary={`${item.name} (x${item.quantity})`}
                  secondary={`$${item.price.toFixed(2)} each, $${(
                    item.price * item.quantity
                  ).toFixed(2)} total`}
                />
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
      </Box>
      {step === "address" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shipping Address (spoken):</Typography>
          <TextField value={inputText} fullWidth disabled sx={{ mt: 1 }} />
        </Box>
      )}
      {step === "payment" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Payment Method (spoken):</Typography>
          <TextField value={inputText} fullWidth disabled sx={{ mt: 1 }} />
        </Box>
      )}
      {step === "confirm" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Order Confirmation</Typography>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography>{confirmation}</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default Checkout;
