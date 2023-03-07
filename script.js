const { ipcRenderer } = require('electron')
const  { Peer } = require('peerjs')

const peer = new Peer('client', {
    host: '192.168.3.151',
    port: 9000,
    path: '/peerjs/myapp'
});

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("startButton").addEventListener("click", () => {
        ipcRenderer.send('stream-start', {});
        document.getElementById("startButton").style.display = "none";
        document.getElementById("stopButton").style.display = "block"
        document.getElementById("stopButton").style.margin = "0 auto"
    });

    document.getElementById("stopButton").addEventListener("click", () => {
        ipcRenderer.send('stream-stop', {});
        document.getElementById("stopButton").style.display = "none";
        document.getElementById("startButton").style.display = "block";
        document.getElementById("startButton").style.margin = "0 auto";
        handleStream(null)
    });

    ipcRenderer.on('stream-data', async (event, sourceId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            handleStream(stream)
            peerStream(stream)
        } catch (e) {
            handleError(e)
        }
    })
    function handleStream (stream) {
        const video = document.querySelector('video')
        video.srcObject = stream
        video.onloadedmetadata = (e) => video.play()
    }
    function handleError (e) {
        console.log(e)
    }

    function peerStream(stream) {
        const call = peer.call('server', stream)
        console.log('Звонок совершен')
    }

})