import axios from 'axios';

const SPEECH_KEY = process.env.AZURE_SPEECH_KEY as string;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION as string;

export async function synthesizeSpeech(text: string, voice = 'en-US-JennyNeural'): Promise<ArrayBuffer> {
    const url = `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const headers = {
        'Ocp-Apim-Subscription-Key': SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
    };
    const body = `
    <speak version='1.0' xml:lang='en-US'>
      <voice name='${voice}'>${text}</voice>
    </speak>`;

    const response = await axios.post(url, body, { headers, responseType: 'arraybuffer' });
    return response.data;
}