 /** @type {import('tailwindcss').Config} */
export default {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
     extend: {
       backgroundImage: {
        'volcanic-night': 'linear-gradient(135deg, #000000 0%, #3E1F13 100%)',
        'ironwood':      'linear-gradient(90deg, #1F1F1F 0%, #8B4513 100%)',
        'charred-cocoa': 'radial-gradient(circle at top left, #4B2E19 0%, #000000 80%)',
        'midnight-ember':'linear-gradient(45deg, #141414 10%, #5C4033 90%)',
        'obsidian-rust': 'linear-gradient(160deg, #000000, #2A1800)',
        'smoky-bourbon':'radial-gradient(ellipse at bottom right, #3B1F00 20%, #0D0D0D 100%)',
      }
     },
   },
   plugins: [],
 }