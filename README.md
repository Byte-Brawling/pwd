# Voice Chat Application

[![Video Demo](/pitch.png)](/pitch.mp4)

*Click the image above to watch a demo of the Voice Chat Application*

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Installation](#installation)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Component Structure](#component-structure)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction

The Voice Chat Application is an innovative chat interface that prioritizes voice communication. Users can send voice messages, which are transcribed and processed by an AI, which then responds with both text and synthesized speech. This README provides an overview of the application's functionality and setup instructions.

## Features

- Voice-based chat interface
- Real-time audio recording and sending
- AI-powered responses with text and audio
- Transcription of voice messages
- Conversation history display
- User authentication and conversation management

## Technologies Used

- Frontend:
  - React.js
  - Next.js
  - Tailwind CSS
  - Lucide React (for icons)
- Backend:
  - Python
  - FastAPI
  - Uvicorn (ASGI server)
- APIs:
  - Speech-to-text API (for transcription)
  - Text-to-speech API (for AI voice responses)
  - AI language model API (for generating responses)

## Installation

The application consists of two parts: the frontend and the backend. Follow the instructions below to set up both parts.

### Frontend Setup

1. Clone the repository:

   ```
   git clone https://github.com/Byte-Brawling/pwd.git
   ```

2. Navigate to the project directory:

   ```
   cd pwd
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add necessary variables:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

### Backend Setup

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:

     ```
     venv\Scripts\activate
     ```

   - On macOS and Linux:

     ```
     source venv/bin/activate
     ```

4. Install the required packages:

   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   Create a `.env` file in the server directory and add necessary variables (adjust as needed for your specific backend setup):

   ```
   DATABASE_URL=your_database_url
   AI_API_KEY=your_ai_api_key
   AZURE_OPENAI_SPEECH_ENDPOINT=your_azure_speech_to_text_endpoint
   AZURE_OPENAI_VOICE_ENDPOINT=your_azure_text_to_speech_endpoint
   AZURE_OPENAI_TEXT_ENDPOINT=your_azure_text_to_text_endpoint
   AZURE_OPENAI_KEY=your_azure_api_key
   DB_URI=your_mongo_db_uri
   ```

## Usage

1. Start the backend server:
   - Navigate to the server directory (if not already there)
   - Ensure your virtual environment is activated
   - Run the following command:

     ```
     uvicorn main:app --reload
     ```

   The backend will start running, typically on `http://localhost:8000`

2. In a new terminal, start the frontend development server:
   - Navigate to the project root directory
   - Run the following command:

     ```
     npm run dev
     ```

3. Open your browser and navigate to `http://localhost:3000`
4. Log in or create an account
5. Select a conversation or start a new one
6. Click the microphone button to start recording your message
7. Click again to stop recording and send the message
8. Wait for the AI response, which will be displayed and played automatically

## API Endpoints

The application interacts with a backend API. The main endpoint used is:

- `POST /messages-ai`: Sends audio message and receives AI response
  - Request body: FormData containing audio file, userId, and conversationId
  - Response: JSON containing transcribed text, AI text response, and audio URLs

## Component Structure

The main component of the application is `ChatInterface`. Here's an overview of its structure:

- `ChatInterface`
  - Manages recording state and audio processing
  - Handles sending audio to backend and receiving responses
  - Displays chat messages and AI responses
  - Controls audio playback for AI responses

Key functions within `ChatInterface`:

- `startRecording()`: Initiates audio recording
- `stopRecording()`: Stops recording and triggers sending to backend
- `sendAudioToBackend()`: Prepares and sends audio data to the API
- `toggleRecording()`: Switches between recording and idle states

## Contributing

Contributions to the Voice Chat Application are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
