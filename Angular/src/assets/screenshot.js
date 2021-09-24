const video = document.querySelector('#screenshot video');

async function startCapture(displayMediaOptions, callback) {
    let captureStream = null;
    let video = document.createElement('video');
    video.style.cssText = "display: none; width: 1px; height: 1px;";
    video.autoplay = true;

    let caputerInterval = null;

    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        video.srcObject = captureStream;

        captureStream.oninactive = () => {
            console.log('Streaming stopped');
            localStorage.removeItem('captureImage')
            stopCapture(video);
            callback();
        };

    } catch (err) {
        video.remove();
        throw err;
    }

    return [captureStream, video];
}

function stopCapture(videoElement) {

    if (!videoElement || !videoElement.srcObject) {
        return;
    }
    let tracks = videoElement.srcObject.getTracks();

    tracks.forEach(tracks => tracks.stop());
    videoElement.srcObject = null;
    videoElement.remove();
}

function captureSnapShot(videoElement) {
    const canvas = document.createElement('canvas');
    try {
        canvas.style.cssText = "desplay: none;";
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        canvas.getContext('2d').drawImage(videoElement, 0, 0);

        let dataUrl = canvas.toDataURL('image/png');
        return dataUrl;
    } catch(err) {
        console.log(err)
        return null;
    } finally {
        canvas.remove();
    }
}