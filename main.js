//Use openAI audio API 
const url = `https://api.openai.com/v1/audio/transcriptions`;
//confirm web support userMedia
if (navigator.mediaDevices) {
  console.log("getUserMedia supported.");
}
var mediaRecorder;
let chunks = [];

const sendRecording = (audioData) => {
  const audioSrc = URL.createObjectURL(audioData);
  document.querySelector("#speech-rec").src = audioSrc;

  if (audioData.size > 0) {
    chunks.push(audioData);
    // make a blob file for voice
    const blob = new Blob(chunks, { type: "audio/webm" });
    whisperCall(blob);
  }
};

//function to send voice file to openAI whisper model (stt)
function whisperCall(blob) {
  let fd = new FormData();
  fd.append("file", blob, "audio.webm");
  fd.append("model", "whisper-1");
  fd.append("response_format", "json");
  const config = {
    headers: {
      "Content-Type": `multipart/form-data`,
      Authorization: `Bearer {OPEN_AI_API_KEY}`,
    },
  };

  const resTxt = document.querySelector(".res-txt");
  axios
    .post(url, fd, config)
    .then((res) => {
      if (res.data.text) {
        resTxt.textContent = res.data.text;
      } else {
        resTxt.textContent = `There exists some error. Please try again.`;
      }
    })
    .catch((err) => {
      console.log("catch error", err.response.data.message);
      resTxt.textContent = `There exists some error, request fail.`;
    });
}

//function for recording voice with web mediaRecorder
const record = async () => {
  if (navigator.getUserMedia) {
    console.log("Starting to record");
    // Get audio stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    // Generate the media recorder with stream from media devices
    // Starting position is paused recording
    mediaRecorder = new MediaRecorder(stream);
    // Also pass the stream to hark to create speaking events
    var speech = hark(stream, {});
    // Start the recording when hark recognizes someone is speakign in the mic
    speech.on("speaking", function () {
      console.log("Speaking!");
      chunks = [];
      mediaRecorder.start();
    });
    // When hark recognizes the speaking has stopped we can stop recording
    // The stop action will generate ondataavailable() to be triggered
    speech.on("stopped_speaking", function () {
      console.log("Not Speaking");
      if (mediaRecorder.state === "recording") mediaRecorder.stop();
    });
    //mediaRecorder event listener, send voice request when voice data is available
    mediaRecorder.ondataavailable = (e) => {
      sendRecording(e.data); /*.then((newMessage) => {
         console.log("send");
       });*/
    };
  } else {
    console.log("recording not supported");
  }
};

//function to stop recording
const stopRecording = async () => {
  if (mediaRecorder) {
    if (mediaRecorder.state === "recording") mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }
};

//button to trigger the record event
const recordBtn = document.querySelector(".record-btn");
const stopBtn = document.querySelector(".stop-btn");
recordBtn.addEventListener("click", record);
stopBtn.addEventListener("click", stopRecording);



//If you just want to send a static file of voice from your local or cloud, you can use a sample code below
const requestBtn = document.querySelector(".request-btn");
requestBtn.addEventListener("click", sendUploadVoice);
function sendUploadVoice() {
  const input = document.querySelector("#uploadFile");
  const curFiles = input.files[0];
  let fd = new FormData();
  fd.append("file", curFiles);
  fd.append("model", "whisper-1");
  fd.append("response_format", "json");
  const config = {
    headers: {
      "Content-Type": `multipart/form-data`,
      Authorization: `Bearer {OPEN_AI_API_KEY}`,
    },
  };

  const resTxt = document.querySelector(".res-txt");
  axios
    .post(url, fd, config)
    .then((res) => {
      if (res.data.text) {
        resTxt.textContent = res.data.text;
      } else {
        resTxt.textContent = `There exists some error. Please try again.`;
      }
    })
    .catch((err) => {
      console.log(err.response.data.message);
      resTxt.textContent = `There exists some error, request fail.`;
    });
}