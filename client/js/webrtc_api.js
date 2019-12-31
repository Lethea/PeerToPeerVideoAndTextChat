class EmreWebrtc {


    constructor(socket) {
        this.localVideo = null;
        this.localStream = null;
        this.remoteVideo = null;
        this.remoteStream = null;
        this.peerConnectionConfig = {'iceServers': []};
        this.localPeer = null;
        this.remotePeer = null;
        this.wsocket = socket;
        this.remoteIceArray = [];
        console.log("Socket------->", this.wsocket);
    }


    async openCameraAndMicrophone(videoElement) {
        console.log("openCameraAndMicrophone", videoElement);
        this.localVideo = document.getElementById(videoElement);
        console.log("Video Element", this.localVideo);

        let constraints =
            {
                video: true,
                audio: true,
            };
        try {
            this.getUserMediaSuccess(await navigator.mediaDevices.getUserMedia(constraints));

        } catch (ex) {
            console.log("HATA ->", ex);
        }
    }

    async getUserMediaSuccess(stream) {
        console.log("getUserMediaSuccess: ", stream);
        this.localStream = stream;
        try {
            this.localVideo.srcObject = stream;
            this.localPeer = new RTCPeerConnection();
            this.localPeer.onicecandidate = this.localIceCandidate.bind(this);
            var that = this;
            this.localStream.getTracks().forEach(function(track){
                that.localPeer.addTrack(track,that.localStream);
            });
            let offer = await this.localPeer.createOffer();
            await this.setLocalDescription(offer);

        } catch (error) {
            console.log("HATA->", error);
            // this.localVideo.src = window.URL.createObjectURL(stream);
        }
    }

    async setLocalDescription(description) {
        console.log("---setLocalDescription---", description);
        let that = this;
        await this.localPeer.setLocalDescription(description, function () {
            console.log("setLocalDescription", description);
            that.wsocket.emit("sendOffer", description);
        })
    }

    localIceCandidate(event) {
        console.log("---localIceCandidate---", event);
        this.wsocket.emit("onIceCandidate", event.candidate);
    }
    remotePeerIceCandidate(event) {
        console.log("---Remote Peer Ice Candidate---", event);
        this.wsocket.emit("remoteOnIceCandidate", event.candidate);
    }

    publishStream() {

    }

    errorHandler(error) {
        console.log("HATA->", error);
    }

    async gotRemoteDescription(description){
        this.remotePeer = new RTCPeerConnection();
        await this.remotePeer.setRemoteDescription(description);
        this.remotePeer.onicecandidate = this.remotePeerIceCandidate.bind(this);
        for(let i=0;i<this.remoteIceArray.length;i++){
            console.log("gotRemoteDescription -> add ice cancidate");
            await this.remotePeer.addIceCandidate(this.remoteIceArray[i]);
        }

        let answer = await this.remotePeer.createAnswer();
        await this.onCreateAnswerSuccess(answer);

        this.remoteVideo = document.getElementById("remoteVideo");
        this.remotePeer.ontrack = function(event){
            console.log("on track",event);
        }
    }
    async onCreateAnswerSuccess(desc){
        await this.remotePeer.setLocalDescription(desc);
        console.log("sending Offer Result As Answer ");
        this.wsocket.emit("createAnswerSdp",desc);
    }
    gotRemoteIceCandidate(iceCandidate){
        if(iceCandidate){
            console.log("Ice candidate add to array");
            this.remoteIceArray.push(iceCandidate);
        }
    }

    gotLocalIceCandidate(iceCandidate){
        console.log("BURAYA");
        if(iceCandidate){
            this.localPeer.addIceCandidate(iceCandidate);
        }
    }

     gotCreateAnswer(desc){
        console.log("Offer Result-->",desc);
        this.localPeer.setRemoteDescription(desc);
    }

}