import React, { useEffect, useRef, useState } from 'react';

const ScenePlayer = () => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [currentScene, setCurrentScene] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        videoRef.current.load();
        videoRef.current?.play();
        setIsPlaying(true);
      };
    
      const handlePauseClick = () => {
        videoRef.current?.pause();
        setIsPlaying(false);
      };

    const scenes = [
        {
            index: 0,
            sentence: "This is a simple Javascript test",
            textPosition: { x: 640, y: 360 }, // Center
            textAnimation: "none",
            media: "https://miro.medium.com/max/1024/1*OK8xc3Ic6EGYg2k6BeGabg.jpeg", // Image URL
            duration: 5, // Scene 0 duration
        },
        {
            index: 1,
            sentence: "Here comes the video!",
            textPosition: { x: 640, y: 360 }, // Center
            textAnimation: "blink",
            media: "/VID.mp4", // Ensure your video is in the public folder
            duration: 3, // Scene 1 duration
        },
    ];

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const interval = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 0.1);
            if (timeElapsed >= scenes[currentScene].duration) {
                //setCurrentScene(prevScene => (prevScene === 0 ? 1 : 0)); // Toggle between scenes
                setCurrentScene(prevScene => (prevScene === 1 ? 0 : 1));
                setTimeElapsed(0);
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0; // Reset video time
                    setIsPlaying(false);
                }
                drawScene(ctx); // 只在场景切换时调用 drawScene，而非每隔 100 毫秒调用一次
                if (videoRef.current && scenes[currentScene].index === 1) {//这个时间点没反
                    videoRef.current.play();
                    //videoRef.current.currentTime = 0; // Reset video time
                    setIsPlaying(true);
                }
                //if (videoRef.current) {
                //    videoRef.current.play();
                //    setIsPlaying(true);
                //  }
            }
            
        }, 100);
        return () => clearInterval(interval);
    }, [timeElapsed, currentScene,isPlaying,scenes]);

    const drawScene = (ctx) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        const scene = scenes[currentScene];
    
        // Handle image for scene 0
        if (scene.index === 0) {
            const img = new Image();
            img.src = scene.media;
            if (img.complete) {
                ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                drawText(ctx, scene.sentence, scene.textPosition.x, scene.textPosition.y);
            } else {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                    drawText(ctx, scene.sentence, scene.textPosition.x, scene.textPosition.y);
                };
            }
        } else if (scene.index === 1) { // Handle video for scene 1
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
            // 确保视频准备好了再绘制
            if (videoRef.current && videoRef.current.readyState >= 2) {
                //ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                videoRef.current.play();
            } else {
                videoRef.current.oncanplay = () => {
                    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                };
                videoRef.current.play();
            }
    
            // 绘制文本
            drawText(ctx, scene.sentence, scene.textPosition.x, scene.textPosition.y);
        }
    };

    const drawText = (ctx, text, x, y) => {
       // if (currentScene === 1) {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, x, y);
       // }
    };

    const handleCanvasClick = () => {
        //if (currentScene === 1) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
                //videoRef.current.pause();
            } else {
                videoRef.current.play();
                setIsPlaying(true);
                //videoRef.current.play().catch(error => console.error('Error playing video:', error));
                
            }
        //}
    };

    const startVideo = () => {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    
      const pauseVideo = () => {
        videoRef.current.play();
        setIsPlaying(true);
      }
    
      const handleVideoPress = () => {
        if (isPlaying) {
          startVideo();
        } else {
          pauseVideo();
        }
      };

      useEffect(() => {
        if (videoRef.current && scenes[currentScene].index === 1) {
          videoRef.current.play();//
        }
      }, [currentScene]);

    return (
        <div>
            <video className="video__player"
                src={scenes[currentScene].media}
                style={{ display: 'none' }} // Hide video element, we draw it on canvas
                autoPlay
                onCanPlay={() => {
                    console.log('Video is ready to play');
                }}
                onEnded={() => {
                    videoRef.current.pause();
                    setIsPlaying(false);
                    setCurrentScene(0); // Switch back to scene 0 after video ends
                }}
                muted
                controls // Optional
                ref={videoRef}
                onClick={handleVideoPress}
                //loop
            />
            <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                onClick={handleCanvasClick}
                //onDoubleClick={handleCanvasDoubleClick}
                style={{ cursor: 'pointer', backgroundColor: '#f0f0f0' }}
            />
            <button className="play-button" onClick={handlePlayClick}>播放</button>
            <button className="play-button" onClick={handlePauseClick}>暂停</button>
            {scenes[currentScene].index === 0  && (
                <div>
                    <span
                        style={{
                            position: 'absolute',
                            top: scenes[1].textPosition.y,
                            left: scenes[1].textPosition.x,
                            fontSize: '30px',
                            fontFamily: 'Arial',
                            textAlign: 'center',
                            animation: 'blink 1s infinite',
                        }}
                    >
                        {scenes[1].sentence}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ScenePlayer;