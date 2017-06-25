const playlist = [{
    title: 'A Step You Can\'t Take Back',
    artist: 'Keira Knightley',
    src: 'static/audios/a-step-you-cant-take-back.mp3'
}, {
    title: 'Coming Up Roses',
    artist: 'Keira Knightley',
    src: 'static/audios/coming-up-roses.mp3'
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
