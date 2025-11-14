import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from "./config/env.js";

const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", 
      ],
    }),
  
    tokenBucket({
      mode: "LIVE",
     
      refillRate: 5, 
      interval: 10, 
      capacity: 10, 
    }),
  ],
});

export default aj;
