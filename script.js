const videoForm = document.getElementById("video-form");
const languageSelect = document.getElementById("language-select");
const resultDiv = document.getElementById("result");
const resultVideo = document.getElementById("result-video");

videoForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the video file and target language
    const videoInput = document.getElementById("video-input");
    const videoFile = videoInput.files[0];
    const targetLanguage = languageSelect.value;

    // Load the video
    const video = mp.VideoFileClip(videoFile);

    // Define the text to be dubbed
    const text = video.audio.get_text();

    // Define the TTS engine
    const client = new texttospeech.TextToSpeechClient();

    // Generate the voiceover in the target language
    const inputText = { text: text };
    const voice = {
        languageCode: targetLanguage,
        name: "en-US-Wavenet-D",
        ssmlGender: "FEMALE"
    };
    const audioConfig = {
        audioEncoding: "MP3"
    };
    const response = await client.synthesizeSpeech(
        { input: inputText, voice: voice, audioConfig: audioConfig }
    );

    // Save the voiceover as an audio file
    const voiceover = response.audioContent;

    // Add the voiceover to the video
    video.audio = mp.AudioFileClip(voiceover);

    // Save the final video
    video.write_videofile("output.mp4").then(() => {
        // Load the final video
        const finalVideo = mp.VideoFileClip("output.mp4");

        // Display the final video
        resultVideo.src = URL.createObjectURL(finalVideo.write_audiofile(""));
        resultDiv.classList.remove("hidden");
    });
});