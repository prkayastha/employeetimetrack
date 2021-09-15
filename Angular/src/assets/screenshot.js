const video = document.querySelector('#screenshot video');

async function startCapture(displayMediaOptions) {
    let captureStream = null;
    let video = document.createElement('video');
    video.style.cssText = "display: none; width: 1px; height: 1px;";

    let caputerInterval = null;

    try {
        captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        video.srcObject = captureStream;

        /* caputerInterval = setInterval(() => {
            let base64Img = captureSnapShot(video);
            localStorage.setItem('captureImage', base64Img);
        }, 5000); */

        captureStream.oninactive = () => {
            console.log('Streaming stopped');
            localStorage.removeItem('captureImage')
            stopCapture(video);
            /* if (!!caputerInterval) {
                debugger;
                console.log('clearing interval')
                clearInterval(caputerInterval);
            } */
        };

    } catch (err) {
        video.remove();
        throw err;
    }

    return [captureStream, video];
}

function stopCapture(videoElement) {
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