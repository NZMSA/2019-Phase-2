import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'

interface IState {
  updateVideoList: any,
  player: any,
  playingURL: string
  videoList: object
}

class App extends React.Component<{}, IState>{
  public constructor(props: any) {
    super(props);
    this.state = {
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
    if(this.state.playingURL === url){
      this.setState({playingURL : ""},() => this.setState({playingURL: url}))
    }else{
      this.setState({playingURL:url})
    }
  }

  public listMounted = (callbacks: any) => {
    this.setState({ updateVideoList: callbacks })
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
            <VideoList play={this.updateURL} mount={this.listMounted} />
          </div>
        </div>
        <CaptionArea currentVideo={this.state.playingURL} play={this.updateURL} />
      </div>
    </div>)
  }
}

export default App;