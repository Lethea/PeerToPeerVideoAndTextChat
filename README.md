# Peer To Peer Webrtc Video Chat
Peer to Peer Webrtc Video & Audio Chat

![Room Page](https://image.prntscr.com/image/u5-KbF4HRWS1EA5_9ODcxA.png)




INSTALLATION
---------------------------------
```
git clone git@github.com:Lethea/PeerToPeerVideoAndTextChat.git
cd signaller
npm install
node video.js
```

 There is two project
1. Client : This includes index.html + websocket connect api 

2. Nodejs Server : This provide login to chat room, listen events, messaging and gateway signaller
   * This is for chatroom application
   * Allows user to login to the given room
   * Allows user to public chat
   * Listen login / disconnect event
   * Ice candidate transfer
   * Create Offer, create answer sdp transfer
   * Publish / Play webrtc Client

On Nodejs Server Run Following Command
```

npm install --save express

npm install --save socket.io

or basically

npm install

```

CONFIGURATION
----------------------------------

The html file must serve on https 
The websocket must use SSL, ( I use nginx for proxy pass to 3000 port)

```
 var socket = io.connect(socketIoConnectionUrl, {
            path: '/emre.io',
            transports: ['websocket']
        });
```

Change the nodejs websocket url in _**client/index.html**_

```
var socketIoConnectionUrl = "https://10.6.1.136";
```
*By default, the nodejs application run on port 3000,
define ssl to nodejs or proxy pass the 443 with socket.io path to 3000*

CONNECT TO CHAT ROOM
-----------------------------

```
cd nodejsserver

node videochat.js
```

Open client/index.html with https on browser ( chrome preferred )

````
https://your_web_server_ip/client/index.html
````

Login Page


* Enter your nickname  (English Characters & Numbers without space required)
* Enter your Room Name (English Characters & Numbers without space required)



Note
-------------
For proxy pass you can use nginx as well

Features
-------------
- [x] Login
- [x] Dynamic Chat Room
- [x] Text Chat
- [x] Play / Publish Implementation
- [x] PeerConnection / Icecandidate etc webrtc stuff implemented

Contact
------------
````
Mail : emre.karatasoglu@hotmail.com
Phone / Whatsapp / Telegram : +90 532 346 67 79
Donate :   1HxYXXDNQen9kDHjdjPrHkj1xS64fkENes ( BTC )
           Ld8BNcvP69146jgT5hVbTzSsnL7q6WoUSg ( LTC )
           0x77935c829b0f12b05151ec7bce31d58a97f735e8 ( ETH )
````

