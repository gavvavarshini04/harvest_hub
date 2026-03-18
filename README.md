
  
  # HarvestHub 🌱


HarvestHub is a comprehensive web applications designed to empower farmers with crop analysis, disease detection, pest control advice, and generalized farming management techniques.

## Features ✨

- **Crop Health Analysis:** Upload images of plant leaves to identify diseases or nutrient deficiencies instantly.
- **Farming Assistant Voice/Chat:** Ask questions about weather, soil, or farming techniques. Supports multiple languages (English, Hindi, Telugu, Malayalam).
- **Secure Backend API Integration:** Includes built-in obfuscation to protect frontend service keys.

## Getting Started 🚀

**Prerequisites:** Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <your-repo-link>
   cd harvest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your required API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

## Security Note 🔒
The frontend API key is strictly obfuscated natively within Vite during the build process to deter basic automated scraping bots. If you plan to deploy this project for wide, public read-write access, we strongly advise transitioning the analysis service calls to a dedicated backend server for maximum security.
## working demo
 <img width="1919" height="1117" alt="image" src="https://github.com/user-attachments/assets/8bbeec44-08cd-473b-be7e-5698366f7aed" />


---
*Built with React, Vite, and TailwindCSS.*
 
