import { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
  Link,
  Divider,
  useMediaQuery,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import { motion } from "framer-motion";
import EchoMarketLogo from "../assets/images/EchoMarket.png";

const palette = {
  primary: "#7dd3fc", // shadcn blue
  secondary: "#f472b6", // shadcn pink
  dark: "#0f172a",
  mid: "#334155",
  light: "#e0f2fe",
  paper: "rgba(17, 24, 39, 0.85)",
};

const SignIn = ({ onLogin }) => {
  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery("(max-width:900px)");
  const [voiceStep, setVoiceStep] = useState(null); // null | 'username' | 'password' | 'done'
  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);

  // Helper: Speak text aloud and only listen after speaking is done
  const speak = (text, afterSpeak) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      speakingRef.current = true;
      utter.onend = () => {
        speakingRef.current = false;
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

  // Voice-driven sign-in flow
  useEffect(() => {
    if (voiceStep === null) {
      setTimeout(() => setVoiceStep("username"), 600);
    } else if (voiceStep === "username") {
      listen("Please say your username.", (result) => {
        if (result.toLowerCase().includes("cancel")) {
          setUsername("");
          setPassword("");
          setVoiceStep(null);
          speak("Sign in cancelled. Please say your username.", () =>
            setVoiceStep("username")
          );
          return;
        }
        setUsername(result);
        setVoiceStep("password");
      });
    } else if (voiceStep === "password") {
      listen("Please say your password.", (result) => {
        if (result.toLowerCase().includes("cancel")) {
          setUsername("");
          setPassword("");
          setVoiceStep(null);
          speak("Sign in cancelled. Please say your username.", () =>
            setVoiceStep("username")
          );
          return;
        }
        setPassword(result);
        setVoiceStep("done");
      });
    } else if (voiceStep === "done") {
      // Auto-login
      speak("Signing you in now.", () => {
        localStorage.setItem(
          "credentials",
          JSON.stringify({ username, password })
        );
        onLogin(username);
      });
    }
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line
  }, [voiceStep]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    localStorage.setItem("credentials", JSON.stringify({ username, password }));
    onLogin(username);
  };

  // Fake Google sign-in handler
  const handleGoogleSignIn = () => {
    onLogin("googleuser");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(120deg, #0f172a 0%, #334155 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 540,
          p: { xs: 4, sm: 8 },
          borderRadius: 0,
          background: "rgba(17, 24, 39, 0.85)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 1, color: palette.primary }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: palette.light, mb: 3 }}>
          Please enter log in details below
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              mb: 2,
              borderRadius: 2,
              background: palette.mid,
              input: { color: palette.light },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: palette.primary }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 1,
              borderRadius: 2,
              background: palette.mid,
              input: { color: palette.light },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: palette.primary }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                    sx={{ color: palette.light }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Link
              href="#"
              sx={{ color: palette.primary, fontSize: 14, fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: "1.05rem",
              letterSpacing: 1,
              background: palette.primary,
              color: palette.dark,
              mb: 1.5,
              boxShadow: "0 2px 8px 0 rgba(125,211,252,0.10)",
              "&:hover": {
                background: palette.secondary,
                color: palette.dark,
              },
            }}
          >
            Sign in
          </Button>
          <Button
            fullWidth
            startIcon={<GoogleIcon />}
            variant="contained"
            sx={{
              mb: 2,
              background: "#fff",
              color: palette.dark,
              fontWeight: 700,
              borderRadius: 3,
              boxShadow: "0 2px 8px 0 rgba(125,211,252,0.10)",
              textTransform: "none",
              "&:hover": {
                background: palette.primary,
                color: palette.dark,
              },
            }}
            onClick={handleGoogleSignIn}
          >
            Log in with Google
          </Button>
          <Typography
            variant="body2"
            sx={{ color: palette.light, textAlign: "center", mt: 2 }}
          >
            Don't have an account?{" "}
            <Link
              component="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              sx={{ color: palette.primary, fontWeight: 500 }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
