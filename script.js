// 预设组合1和组合2的音频和图片（本地资源路径）
const sets = [
    {
        audio: "audio/prk.mp3",  // 北韩
        image: "assets/images/prk.png"
    },
    {
        audio: "audio/kor.mp3",  // 朝鲜南
        image: "assets/images/kor.png"
    }
];

// 获取页面元素
const audioElement = document.getElementById("audio");
const imageElement = document.getElementById("image");
const toggleButton = document.getElementById("toggleButton");
const playPauseButton = document.getElementById("playPauseButton");
const playPauseIcon = document.getElementById("playPauseIcon");
const labelElement = document.getElementById("label");

// 用于记录当前播放的组合
let currentSet = 0;  // 默认从“忠诚”开始（即组合1）

// 获取上次播放进度（如果有的话）
let lastProgress = parseFloat(localStorage.getItem("audioProgress")) || 0;
let isPlaying = false;  // 初始状态为暂停

// 加载音频和图片
function loadMedia() {
    const set = sets[currentSet];
    imageElement.src = set.image;

    // 如果音频没有播放，则不重新加载音频
    if (audioElement.src !== set.audio) {
        audioElement.src = set.audio;
        audioElement.currentTime = lastProgress; // 恢复上次的进度
        audioElement.load(); // 重新加载新的音频资源
    }
}

// 淡入淡出音频
function fadeAudio() {
    const fadeDuration = 200; // 0.2秒
    let fadeInInterval = setInterval(() => {
        if (audioElement.volume < 1) {
            audioElement.volume += 0.05;
        } else {
            clearInterval(fadeInInterval);
        }
    }, fadeDuration / 20);
}

// 切换组合
toggleButton.addEventListener("click", function() {
    // 暂停当前音频，保存当前进度
    lastProgress = audioElement.currentTime;
    localStorage.setItem("audioProgress", lastProgress);

    // 切换当前播放组合
    currentSet = (currentSet + 1) % 2;
    
    // 更新按钮文字和当前模式标签
    if (currentSet === 0) {
        toggleButton.textContent = "切换为恩情";
        labelElement.textContent = "当前模式: 忠诚";
    } else {
        toggleButton.textContent = "切换为忠诚";
        labelElement.textContent = "当前模式: 恩情";
    }

    // 仅在播放状态下才加载并播放
    if (isPlaying) {
        loadMedia(); // 加载新的音频和图片
        fadeAudio(); // 淡入新的音频
        audioElement.play();  // 保持音频播放
    }
});

// 点击开始/暂停按钮
playPauseButton.addEventListener("click", function() {
    if (isPlaying) {
        // 暂停音频
        audioElement.pause();
        playPauseIcon.src = "assets/icons/play.png";  // 更换为播放图标
        labelElement.textContent = "当前模式: 暂停";
        imageElement.style.display = "none";  // 暂停时隐藏图片
    } else {
        // 播放音频
        audioElement.play();
        playPauseIcon.src = "assets/icons/pause.png";  // 更换为暂停图标
        labelElement.textContent = currentSet === 0 ? "当前模式: 忠诚" : "当前模式: 恩情";
        imageElement.style.display = "block";  // 播放时显示图片
    }
    isPlaying = !isPlaying;  // 切换播放状态
});

// 初始化页面，立即加载资源
loadMedia();