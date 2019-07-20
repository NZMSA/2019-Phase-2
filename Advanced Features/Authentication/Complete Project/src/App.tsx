import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css';
import * as Webcam from "react-webcam";

interface IState {
    updateVideoList: any,
    player: any,
    playingURL: string
    videoList: object,
    authenticated: boolean,
    refCamera: any,
    predictionResult: any
}

class App extends React.Component<{}, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            player: null,
            playingURL: "",
            updateVideoList: null,
            videoList: [],
            authenticated: false,
            refCamera: React.createRef(),
            predictionResult: null
        }

        this.authenticate = this.authenticate.bind(this)

    }

    public setRef = (playerRef: any) => {
        this.setState({
            player: playerRef
        })
    }

    public addVideo = (url: string) => {
        const body = { "url": url }
        fetch("https://scriberapi.azurewebsites.net/api/Videos", {
            body: JSON.stringify(body),
            headers: {
                Accept: "text/plain",
                "Content-Type": "application/json"
            },
            method: "POST"
        }).then(() => {
            this.state.updateVideoList();
        })
    }

    public updateURL = (url: string) => {
        if (this.state.playingURL === url) {
            this.setState({ playingURL: "" }, () => this.setState({ playingURL: url }))
        } else {
            this.setState({ playingURL: url })
        }
    }

    public listMounted = (callbacks: any) => {
        this.setState({ updateVideoList: callbacks })
    }

    public render() {

        const { authenticated } = this.state

        return (<div>

            <div>
                {(!authenticated) ?
                    <div>
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={this.state.refCamera}
                        />
                        <div className="row nav-row">
                            <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
                        </div>
                    </div>
                    : ""}


                {(authenticated) ?
                    <div>
                        <Header addVideo={this.addVideo} />
                        <div className="container">
                            <div className="row">
                                <div className="col-7">
                                    <ReactPlayer
                                        className="player"
                                        ref={this.setRef}
                                        controls={true}
                                        url={this.state.playingURL}
                                        width="100%"
                                        height="400px"
                                        playing={true}
                                        config={{
                                            youtube: {
                                                playerVars: { showinfo: 1 },
                                                preload: true
                                            }
                                        }
                                        }
                                    />
                                </div>
                                <div className="col-5">
                                    <VideoList play={this.updateURL} mount={this.listMounted} />
                                </div>
                            </div>
                            <CaptionArea currentVideo={this.state.playingURL} play={this.updateURL} />
                        </div>
                    </div>
                    : ""}

            </div>

        </div>)
    }

    // Call custom vision model
    private getFaceRecognitionResult(image: string) {
        const url = "[API-ENDPOINT]"
        if (image === null) {
            return;
        }
        const base64 = require('base64-js');
        const base64content = image.split(";")[1].split(",")[1]
        const byteArray = base64.toByteArray(base64content);
        fetch(url, {
            body: byteArray,
            headers: {
                'cache-control': 'no-cache', 'Prediction-Key': '[API-KEY]', 'Content-Type': 'application/octet-stream'
            },
            method: 'POST'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error State
                    alert(response.statusText)
                } else {
                    response.json().then((json: any) => {
                        console.log(json.predictions[0])

                        this.setState({ predictionResult: json.predictions[0] })
                        if (this.state.predictionResult.probability > 0.7) {
                            this.setState({ authenticated: true })
                        } else {
                            this.setState({ authenticated: false })
                            console.log(json.predictions[0].tagName)
                        }
                    })
                }
            })
    }

    // Authenticate
    private authenticate() {
        const screenshot = this.state.refCamera.current.getScreenshot();
        this.getFaceRecognitionResult(screenshot);
    }

}

export default App;