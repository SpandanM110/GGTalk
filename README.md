# GGTalk

GGTalk is a **voice-enabled chat application** built with Next.js. It uses **SpeechRecognition** (via [`react-speech-recognition`](https://www.npmjs.com/package/react-speech-recognition)) to convert your spoken words into text, and **Google Generative AI** (Gemini/PaLM API) to generate intelligent, context-aware responses. The application then **speaks** those responses aloud with the Web Speech Synthesis API.

![image](https://github.com/user-attachments/assets/e2d86965-89b3-481f-8311-58f889f3561e)


## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [System Requirements](#system-requirements)  
5. [Project Structure](#project-structure)  
6. [Getting Started](#getting-started)  
7. [Configuration](#configuration)  
8. [Usage](#usage)  
9. [Under the Hood](#under-the-hood)  
10. [Troubleshooting](#troubleshooting)  
11. [Deployment](#deployment)  
12. [Contributing](#contributing)  
13. [License](#license)  
14. [Contact & Support](#contact--support)

---

## Overview

- **Name**: GGTalk  
- **Description**: Real-time speech-to-text conversation app with AI responses.  
- **Primary Goal**: Provide an **interactive**, **hands-free** way for users to ask questions and get friendly responses.  

GGTalk is ideal for quick prototyping, voice-enabled applications, or demonstrating the power of **Voice Recognition** combined with **Generative AI**.

---

## Features

1. **Voice Recognition**  
   - Uses [`react-speech-recognition`](https://www.npmjs.com/package/react-speech-recognition) to capture microphone input and convert to text.
2. **AI-Assisted Responses**  
   - Integrates [Google Generative AI](https://developers.generativeai.google/), such as Gemini or PaLM, to understand and respond to user queries.
3. **Text-to-Speech**  
   - Leverages the built-in Web Speech Synthesis API to speak AI responses back to the user.
4. **Conversation Sidebar**  
   - A collapsible/fixed sidebar displays the **chat history** for easy browsing of past messages and AI responses.
5. **Responsive UI**  
   - Built with [Tailwind CSS](https://tailwindcss.com) and Next.js, ensuring it works across mobile, tablet, and desktop.
6. **Multi-Environment**  
   - Local development and easy deployment to hosting services like Vercel, Netlify, or any Node.js-capable platform.

---

## Technologies Used

- **Next.js** (React framework)  
- **Tailwind CSS** (Utility-first CSS framework)  
- **React Speech Recognition** (`react-speech-recognition`) for capturing voice input  
- **Google Generative AI** / [`@google/generative-ai`](https://www.npmjs.com/package/@google/generative-ai) for AI responses  
- **Web Speech API** for speech synthesis (text-to-speech)

---

## System Requirements

- **Node.js**: `^14.17.0` or newer (recommended: `^16.0.0`)  
- **npm**: `^6.0.0` or **Yarn**: `^1.22.0`  
- **Modern Browser**: Must support the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) (for best results, use Chrome)

*(Note: Safari and Firefox have partial or experimental support for the Web Speech API. Check [caniuse.com](https://caniuse.com/))*

---

## Project Structure

A typical Next.js + Tailwind + AI integration structure:

```
GGTalk/
├── components/
│   └── ConversationPage.js     # Core AI + speech logic
├── pages/
│   ├── index.js                # Renders ConversationPage (or any custom UI)
│   └── _app.js                 # Next.js root App, global styles
├── public/                     # Public assets (images, etc.)
├── .env.local                  # Local environment variables (gitignored)
├── tailwind.config.js          # Tailwind configuration
├── package.json
├── README.md                   # This file
└── ... (other config files, optional)
```

---

## Getting Started

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/SpandanM110/GGTalk.git
   cd GGTalk
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**  
   - You must have a `NEXT_PUBLIC_GEMINI_API_KEY` for Google Generative AI.  
   - See [Configuration](#configuration) below.

4. **Run in Development**  
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   - By default, the app is served at [http://localhost:3000](http://localhost:3000).

5. **Open in Browser**  
   - Go to [http://localhost:3000](http://localhost:3000).  
   - You should see the GGTalk UI with a big microphone animation.

---

## Configuration

### Environment Variables

Create a `.env.local` file (automatically ignored by Git) in the root directory:

```ini
# .env.local
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GOOGLE_GENERATIVE_AI_KEY
```

- `NEXT_PUBLIC_GEMINI_API_KEY`:  
  Your **public** environment variable for the [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) library.  
  *Note*: The prefix `NEXT_PUBLIC_` is required for Next.js to expose it to the frontend.

**Security Note**:  
- The Google Generative AI key is somewhat sensitive, but for browser-based apps, it inevitably becomes public. Consider usage quotas or domain restrictions in your Google Cloud Console to protect it from abuse.

---

## Usage

1. **Launching**:
   - From the root of your project, run `npm run dev` (or `yarn dev`).
   - Navigate to `http://localhost:3000`.

2. **Start/Stop Listening**:
   - Click the **Start** button to begin capturing microphone input.  
   - Speak your query or message.
   - GGTalk detects when you stop speaking, and after a short delay, sends the transcribed text to the AI.

3. **Getting AI Responses**:
   - The AI responds with a text message that GGTalk **speaks aloud** to you using the Web Speech API.
   - This text is also appended to the conversation in the sidebar.

4. **Show/Hide Conversations**:
   - Click **Show Conversations** (top-left) to open the conversation sidebar.  
   - Click **Hide Conversations** to close it again, saving screen space.

5. **Stop**:
   - At any time, click the **Stop** button to end continuous listening.  

6. **Expand/Collapse** (Optional):
   - If you have “expandedAll” logic, you can view the entire conversation text or just a snippet.

---

## Under the Hood

1. **Speech to Text**:  
   - [React Speech Recognition](https://www.npmjs.com/package/react-speech-recognition) uses the browser’s native `SpeechRecognition` API.  
   - The recognized text is stored in a `transcript` variable, and once idle for ~6 seconds, GGTalk sends it to the AI.

2. **AI Calls**:  
   - Using [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai), GGTalk connects to the [Gemini or PaLM API](https://developers.generativeai.google/).  
   - Your `NEXT_PUBLIC_GEMINI_API_KEY` is used here.  
   - The AI returns a response, which is then appended to the chat history.

3. **Text-to-Speech**:  
   - [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) is used to speak the AI’s response.  
   - In the code, you can adjust the `.rate`, `.voice`, `.pitch` if you want different speaking styles.

4. **Sidebar**:  
   - A fixed or collapsible sidebar lists all message objects: user messages vs. AI messages.  
   - Responsive widths for mobile (`w-full`) vs. desktop (`sm:w-72`, etc.).

5. **Responsive Design**:  
   - Tailwind classes like `sm:w-64`, `sm:text-lg`, `fixed top-4 left-4`, and more adapt the UI across screen sizes.

---

## Troubleshooting

1. **Mic Not Detected**:
   - Ensure your **browser** has permission to access the microphone.  
   - If on **Chrome**, check `chrome://settings/content/microphone`.  
   - If on **Safari**, enable **Web Speech** in experimental features or use an alternative.

2. **AI Not Responding**:
   - Check that your **API key** is correct in `.env.local`.
   - Inspect the **browser console** or **terminal** logs for error messages from the AI endpoint.

3. **Text-to-Speech Not Working**:
   - Some browsers require **user interaction** (click/tap) before speaking can be triggered.  
   - Make sure your **speaker volume** is on.

4. **Styles Not Loading**:
   - Verify `tailwind.config.js` is properly set up and that you have imported the Tailwind styles (e.g., in `globals.css` or `_app.js`).

---

## Deployment

### Deploy to Vercel

1. **Create** a [Vercel](https://vercel.com) account (if you haven’t already).
2. **Import** the GGTalk GitHub repo into Vercel.
3. In your **Vercel Project Settings**, add the environment variable:  
   `NEXT_PUBLIC_GEMINI_API_KEY=YOUR_KEY`
4. Click **Deploy**.  
   - Vercel automatically handles building and hosting Next.js apps.

### Deploy to Netlify (Alternative)

1. **Install** the Next on Netlify plugin if needed.  
2. Create a new **Netlify site** from your GitHub repo.  
3. In the site **settings**, add environment variables under **Build & Deploy** → **Environment**.  
4. Netlify will build your Next.js site with the configured environment vars.

### Other Hosting Options

- You can run `npm run build` then `npm run start` on any VPS or Node-friendly platform.  
- Just make sure to set your environment variables on the server.

---

## Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository.  
2. Create a new **feature branch**:  
   ```bash
   git checkout -b feature/awesome-change
   ```
3. **Commit** your changes:  
   ```bash
   git commit -m "Add awesome feature"
   ```
4. **Push** to your fork:  
   ```bash
   git push origin feature/awesome-change
   ```
5. **Open a Pull Request** against the `main` branch.

We appreciate fixes, new features, or documentation improvements!

---

## License

Unless otherwise stated, **GGTalk** is released under the [MIT License](https://opensource.org/licenses/MIT).  
See the [LICENSE](LICENSE) file for details.

---

## Contact & Support

- **Author**: [@SpandanM110](https://github.com/SpandanM110)  
- **GitHub**: [GGTalk Repo](https://github.com/SpandanM110/GGTalk)

For **bugs** or **feature requests**, please open an **issue** on the [GitHub repo](https://github.com/SpandanM110/GGTalk/issues).  

If you need **further assistance**, feel free to reach out via GitHub or email (if provided).

Thank you for using **GGTalk**! Let your voice do the talking.
