const textBox = document.getElementById('textBox');

const colorDim = '#9a9a9a';
const alertStr = `Caution: microphone permission required.
Please click on the red cross in address bar to allow it.`;
const recognizingStr = 'recognizing...';

const langSelect = document.getElementById('lang-select');
const toggleBut = document.getElementById('toggleBut');
const loadingIcon = document.getElementById('loading-icon');

loadingIcon.hidden = true;
let recognizing = false;

const recog = new webkitSpeechRecognition();
recog.continuous = true;
recog.interimResults = true;
recog.lang = "te-IN";

toggleBut.onclick = function() {
  recognize();
}

function detect_mic_and_recognize() {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(recognize)
    .catch(() => {
      alert(alertStr);
    });
}

function recognize() {
  if (recognizing) {
    recog.stop();
  } else {
    textBox.innerHTML = '';
    recog.start();
  }
}

recog.onstart = () => {
  textBox.innerHTML = '';
  recognizing = true;
  toggleBut.value = 'ఆపండి';
  textBox.style.color = colorDim;
  loadingIcon.hidden = false;
};

recog.onend = () => {
  recognizing = false;
  toggleBut.value = 'ప్రారంభించండి';
  loadingIcon.hidden = true;
  if (textBox.innerText == recognizingStr) {
    textBox.style.color = colorDim;
    textBox.innerText = 'idle';
  }
};

recog.onresult = (e) => {
  let idx = e.resultIndex;
  let result = e.results[idx];
  let pos = result.length - 1;
  let txt = result[pos].transcript;
  textBox.style.color = colorDim;
  // textBox.innerHTML = txt;     // this one
  console.log(txt);

  if (result.isFinal) {
    textBox.innerHTML += " " + txt;    // this one
    textBox.style.color = 'black';
    loadingIcon.hidden = true;
  }
};

let copyBtn = document.querySelector("#clipboard");
copyBtn.onclick = function(e) {
  console.log(this);
  navigator.clipboard.writeText(textBox.innerHTML);
}


document.onkeyup = (e) => {
  if (e.code === 'Space') {
    recognize();
  }
};

window.onload = () => recognize();
