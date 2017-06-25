const playlist = [{
    title: 'A Step You Can\'t Take Back',
    artist: 'Keira Knightley',
    src: 'static/audios/a-step-you-cant-take-back.mp3'
}, {
    title: 'Coming Up Roses',
    artist: 'Keira Knightley',
    src: 'static/audios/coming-up-roses.mp3'
}, {
    title: 'Lost Stars',
    artist: 'Adam Levine',
    src: 'static/audios/lost-stars.mp3'
}, {
    title: 'Tell Me If You Wanna Go Home',
    artist: 'Keira Knightley, Hailee Steinfield',
    src: 'static/audios/tell-me-if-you-wanna-go-home.mp3'
}];
let index = 0;

const audio = new Audio();
audio.autoplay = true;

const actions = {
    play(index) {
        if (index === undefined) {
            audio.play();
        } else {
            audio.src = playlist[index].src;
            audio.play();
            updateInterface(playlist[index]);
        }
    },
    pause() {
        audio.pause();
    },
    next() {
        index = (index + 1) % playlist.length;
        this.play(index);
    },
    previous() {
        index = index > 0 ? index - 1 : playlist.length - 1;
        this.play(index);
    }
};

function updateInterface(data) {
    document.querySelector('h1').textContent = data.title;
    document.querySelector('h2').textContent = data.artist;
}

audio.onended = actions.next.bind(actions);
audio.onplay = () => {
    const button = document.querySelector('button.play');
    if (button) {
        button.classList.add('pause');
        button.classList.remove('play');
    }
};
audio.onpause = () => {
    const button = document.querySelector('button.pause');
    if (button) {
        button.classList.add('play');
        button.classList.remove('pause');
    }
};

actions.play(index);

document.addEventListener('click', (e) => {
    if (e.target.matches('button')) {
        const action = e.target.className;
        actions[action]();
    }
});



// Audio Visualization
const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');

const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

const audioData = new Float32Array(analyser.frequencyBinCount);

const linesCount = 100;
const indexInterval = Math.floor(audioData.length / linesCount);
const lineInterval = canvas.width / linesCount;
const maxLength = canvas.height / 2;

canvasCtx.strokeStyle = '#ad1457';
canvasCtx.lineWidth = 3;
canvasCtx.lineCap = 'round';

(function visualize() {
    requestAnimationFrame(visualize);
    if (audio.paused) {
        return null;
    }

    analyser.getFloatTimeDomainData(audioData);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.beginPath();

    for (let i = 0; i < linesCount; i++) {
        const data = audioData[i * indexInterval];
        const x = lineInterval * i + lineInterval / 2;
        const y1 = maxLength - maxLength * data;
        const y2 = maxLength + maxLength * data;
        canvasCtx.moveTo(x, y1);
        canvasCtx.lineTo(x, y2);
    }

    canvasCtx.stroke();
})();
