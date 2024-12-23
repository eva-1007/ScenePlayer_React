import React, { useRef, useState, useEffect } from 'react';

const scenes = [
    {
        index: 0,
        sentence: "This is a simple Javascript test",
        textPosition: { x: 320, y: 180 }, // Center for canvas of 640x360
        textAnimation: "none",
        media: "https://miro.medium.com/max/1024/1*OK8xc3Ic6EGYg2k6BeGabg.jpeg", // Image URL
        duration: 5, // Scene 0 duration
    },
    {
        index: 1,
        sentence: "Here comes the video!",
        textPosition: { x: 320, y: 180 }, // Center for canvas of 640x360
        textAnimation: "blink",
        media: "/VID.mp4", // Ensure your video is in the public folder
        duration: 3, // Scene 1 duration
    },
];

const ScenePlayer = () => {
    const canvasRef = useRef(null);
    const videoRef1 = useRef(null);
    const videoRef2 = useRef(null);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        videoRef1.current = document.createElement('video');
        videoRef1.current.src = scenes[0].media; // 第一个场景的视频或图像
        videoRef2.current = document.createElement('video');
        videoRef2.current.src = scenes[1].media; // 第二个场景的视频

        // 加载第一个视频
        videoRef1.current.load();
    }, []);

    // 将 drawVideo 移到这里
    const drawVideo = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (isPlaying) {
            context.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
            const currentVideo = currentSceneIndex === 0 ? videoRef1.current : videoRef2.current;

            context.drawImage(currentVideo, 0, 0, canvas.width, canvas.height);
            
            // 绘制文本
            const currentScene = scenes[currentSceneIndex];
            context.fillStyle = 'white';
            context.font = '24px Arial';
            
            // 根据动画效果绘制文本
            if (currentScene.textAnimation === "blink") {
                const blink = Math.floor(Date.now() / 500) % 2 === 0; // 每500ms闪烁一次
                if (blink) {
                    context.fillText(currentScene.sentence, currentScene.textPosition.x, currentScene.textPosition.y);
                }
            } else {
                context.fillText(currentScene.sentence, currentScene.textPosition.x, currentScene.textPosition.y);
            }

            requestAnimationFrame(drawVideo);
        }
    };

    const playVideo = () => {
        setIsPlaying(true);
        const currentVideo = currentSceneIndex === 0 ? videoRef1.current : videoRef2.current;
        currentVideo.play();
        drawVideo(); // 确保 drawVideo 在这里被调用
    };

    const pauseVideo = () => {
        setIsPlaying(false);
        const currentVideo = currentSceneIndex === 0 ? videoRef1.current : videoRef2.current;
        currentVideo.pause();
    };

    const stopVideo = () => {
        setIsPlaying(false);
        const currentVideo = currentSceneIndex === 0 ? videoRef1.current : videoRef2.current;
        currentVideo.pause();
        currentVideo.currentTime = 0; // 重置到开头
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    };

    useEffect(() => {
        const handleVideoEnd = () => {
            setCurrentSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
            playVideo();
        };

        videoRef1.current.addEventListener('ended', handleVideoEnd);
        videoRef2.current.addEventListener('ended', handleVideoEnd);

        return () => {
            videoRef1.current.removeEventListener('ended', handleVideoEnd);
            videoRef2.current.removeEventListener('ended', handleVideoEnd);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width="640" height="360" style={{ border: '1px solid black', cursor: 'pointer' }} />
        </div>
    );
};

export default ScenePlayer;