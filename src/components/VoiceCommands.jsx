import { useEffect, useRef, useState } from "react";
import {
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../assets/products";

// Large dataset of phrases for each intent
const COMMANDS = [
  {
    intent: "go_to_cart",
    phrases: [
      "go to cart",
      "show cart",
      "open cart",
      "take me to my cart",
      "cart page",
      "view cart",
      "show me my cart",
      "display cart",
      "cart",
      "shopping cart",
    ],
    feedback: "Navigating to your cart.",
  },
  {
    intent: "show_products",
    phrases: [
      "show products",
      "show me products",
      "browse products",
      "display products",
      "see products",
      "product list",
      "all products",
      "show all products",
      "products page",
      "see what's for sale",
      "what do you have",
      "what can I buy",
      "show me what's available",
    ],
    feedback: "Showing all products.",
  },
  {
    intent: "checkout",
    phrases: [
      "checkout",
      "proceed to checkout",
      "buy now",
      "finish my order",
      "place order",
      "complete purchase",
      "pay now",
      "go to checkout",
      "check out",
    ],
    feedback: "Taking you to checkout.",
  },
  {
    intent: "add_to_cart",
    phrases: [
      "add * to cart",
      "put * in cart",
      "add *",
      "i want *",
      "buy *",
      "add the * to my cart",
      "put the * in my cart",
      "add the *",
      "i want to buy *",
      "can you add * to my cart",
      "please add * to my cart",
    ],
    feedback: (product) => `Trying to add ${product} to your cart.`,
  },
  {
    intent: "greeting",
    phrases: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "what's up",
      "how are you",
    ],
    feedback: "Hello! How can I help you today?",
  },
  {
    intent: "help",
    phrases: [
      "help",
      "what can i say",
      "what commands are there",
      "show help",
      "voice commands",
      "how do i use this",
      "what can you do",
    ],
    feedback:
      "You can say things like: 'show products', 'go to cart', 'add headphones to cart', or 'checkout'.",
  },
];

function matchCommand(text) {
  const lower = text.toLowerCase();
  for (const cmd of COMMANDS) {
    for (const phrase of cmd.phrases) {
      if (phrase.includes("*")) {
        // Wildcard match for add_to_cart
        const regex = new RegExp(
          phrase.replace("*", "(.+)").replace(/ /g, "\\s*"),
          "i"
        );
        const match = lower.match(regex);
        if (match && match[1]) {
          return {
            intent: cmd.intent,
            product: match[1].trim(),
            feedback:
              typeof cmd.feedback === "function"
                ? cmd.feedback(match[1].trim())
                : cmd.feedback,
          };
        }
      } else {
        if (lower.includes(phrase)) {
          return {
            intent: cmd.intent,
            feedback:
              typeof cmd.feedback === "function"
                ? cmd.feedback()
                : cmd.feedback,
          };
        }
      }
    }
  }
  return null;
}

function fuzzyFindProduct(spokenName) {
  const lower = spokenName.toLowerCase();
  // Try to find a product whose name includes the spoken words
  return products.find(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      lower.includes(p.name.toLowerCase().split(" ")[0])
  );
}

const VoiceCommands = ({ setCurrentPage, addToCart, cart }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);
  const listeningRef = useRef(false);
  const isProcessingRef = useRef(false);
  const speakingRef = useRef(false);

  // Always-on mic: start listening on mount
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        showFeedbackMessage("Listening...");
        isProcessingRef.current = false;
      };

      recognition.onerror = (event) => {
        showFeedbackMessage("Error: " + event.error);
        setIsListening(false);
        listeningRef.current = false;
      };

      recognition.onend = () => {
        setIsListening(false);
        listeningRef.current = false;
        // Restart listening automatically, but only if not speaking
        setTimeout(() => {
          if (!isListening && !speakingRef.current) {
            try {
              recognition.start();
              setIsListening(true);
              listeningRef.current = true;
              setLastTranscript("");
              setResponse("");
            } catch (e) {}
          }
        }, 400);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setLastTranscript(finalTranscript || interimTranscript);
        if (finalTranscript && !isProcessingRef.current) {
          isProcessingRef.current = true;
          handleVoiceCommand(finalTranscript.toLowerCase().trim());
        }
      };

      recognitionRef.current = recognition;
      // Start listening immediately
      try {
        recognition.start();
        setIsListening(true);
        listeningRef.current = true;
      } catch (e) {}
    } else {
      showFeedbackMessage("Speech Recognition Not Available");
    }
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onstart = null;
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line
  }, []);

  const showFeedbackMessage = (message) => {
    setFeedback(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  // Speak the response using browser TTS, pause recognition while speaking
  const speak = (text) => {
    if (window.speechSynthesis) {
      speakingRef.current = true;
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.onend = () => {
        speakingRef.current = false;
        // Restart recognition after speaking
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
            listeningRef.current = true;
          } catch (e) {}
        }
      };
      window.speechSynthesis.speak(utter);
    }
  };

  // Robust command handler with large dataset
  const handleVoiceCommand = (command) => {
    const match = matchCommand(command);
    let reply = "";
    if (match) {
      if (match.intent === "go_to_cart") {
        setCurrentPage("cart");
        reply = match.feedback;
      } else if (match.intent === "show_products") {
        setCurrentPage("products");
        reply = match.feedback;
      } else if (match.intent === "checkout") {
        setCurrentPage("checkout");
        reply = match.feedback;
        // Speak cart summary after a short delay to allow navigation
        setTimeout(() => {
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
        }, 800);
      } else if (match.intent === "add_to_cart" && match.product) {
        // Fuzzy match product name
        const found = fuzzyFindProduct(match.product);
        if (found) {
          if (addToCart) addToCart(found);
          reply = `Added ${found.name} to your cart.`;
        } else {
          reply = `Sorry, I couldn't find a product matching "${match.product}".`;
        }
      } else {
        reply = match.feedback;
      }
      reply = reply || match.feedback;
    } else {
      reply = "Sorry, I didn't understand that.";
    }
    setResponse(reply);
    speak(reply);
  };

  // Hide mic button since always listening (optional: comment out to show)
  // const showMicButton = false;

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 1300,
          minWidth: 320,
        }}
      >
        <Paper
          elevation={4}
          sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper", mb: 1 }}
        >
          <Typography variant="subtitle2" color="text.secondary">
            Last command:
          </Typography>
          <Typography
            variant="body1"
            color="primary.main"
            sx={{ fontWeight: 600 }}
          >
            {lastTranscript || (
              <span style={{ color: "#888" }}>Say something…</span>
            )}
          </Typography>
          {response && (
            <Typography variant="body2" color="secondary.main" sx={{ mt: 1 }}>
              {response}
            </Typography>
          )}
        </Paper>
      </Box>
      {/*
      <Tooltip
        title={isListening ? "Stop Voice Commands" : "Start Voice Commands"}
      >
        <Fab
          color={isListening ? "secondary" : "primary"}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            transition: "all 0.3s ease-in-out",
          }}
          onClick={toggleListening}
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isListening ? <MicIcon /> : <MicOffIcon />}
        </Fab>
      </Tooltip>
      */}
      <Snackbar
        open={showFeedback}
        autoHideDuration={2000}
        onClose={() => setShowFeedback(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="info"
          sx={{ width: "100%" }}
          onClose={() => setShowFeedback(false)}
        >
          {feedback}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VoiceCommands;
