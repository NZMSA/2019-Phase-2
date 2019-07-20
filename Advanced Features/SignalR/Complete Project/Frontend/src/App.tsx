import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'

interface IState {
  hubConnection: any,
  updateVideoList: any,
  player: any,
  playingURL: string
  videoList: object
}

class App extends React.Component<{}, IState>{
  public signalR = require("@aspnet/signalr");
  public constructor(props: any) {
    super(props);
    this.state = {
      hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://localhost:44303/hub").build(),
      player: null,
      playingURL: "",
      updateVideoList: null,
      videoList: [],
    }
  }

  public setRef = (playerRef: any) => {
    this.setState({
      player: playerRef
    })
  }

  public addVideo = (url: string) => {
    const body = {"url": url}
    fetch("https://localhost:44303/api/Videos", {
      body: JSON.stringify(body),
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(() => {
      this.state.updateVideoList();
    }).then(() => {this.state.hubConnection.invoke("VideoAdded")});
  }

  public updateURL = (url: string) => {
    if(this.state.playingURL === url){
      this.setState({playingURL : ""},() => this.setState({playingURL: url}))
    }else{
      this.setState({playingURL:url})
    }
  }

  public listMounted = (callbacks: any) => {
    this.setState({ updateVideoList: callbacks })
  }


  public componentDidMount = () => {

    this.state.hubConnection.on("Connect", ()  => {
      console.log('A new user has connected to the hub.');
    });

    this.state.hubConnection.on("UpdateVideoList", ()  => {
      this.state.updateVideoList();
      console.log('A new video has been added!');
  });

    this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
}

  public render() {
    return (<div>
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
            <VideoList play={this.updateURL} mount={this.listMounted} hubConnection={this.state.hubConnection} />
          </div>
        </div>
        <CaptionArea currentVideo={this.state.playingURL} play={this.updateURL}  />
      </div>
    </div>)
  }
}

export default App;