# Speech-To-Text Sample
This is a simple speech-to-text example, combining web api: MediaRecorder with OpenAI Whisper stt api.
The main purpose: Sending a voice file to the OpenAI Whisper stt to recognize the speech into text.

## Key points
* First confirm web support userMedia or not
* If it supports, using mediaRecorder to record the speeking
* The project uses axios to send the request, but you can replace it with whatever you want
* Hark plugin plays a role to identify the pause when we speak



## Plugins:
* Axios - https://github.com/axios/axios
* Hark - https://github.com/latentflip/hark


## Reference
* [AI Audio Conversations Using OpenAI Whisper](https://medium.com/@david.richards.tech/ai-audio-conversations-with-openai-whisper-3c730a9c7123)
* [Speech to text-OpenAI API](https://platform.openai.com/docs/guides/speech-to-text)
* [MediaRecorder mdn](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
