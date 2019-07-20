import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'

interface IState {
    playingUrl:any,
    updateVideoList:any,
}

class App extends React.Component<{}, IState>{
  public constructor(props: any) {
    super(props);
    this.state = {
      playingUrl:"",
      updateVideoList:null,
    }
  }

  public addVideo = (url:any) =>{
    const body = {"url":url}
    fetch("https://scriberapi.azurewebsites.net/api/Videos",{
      body:JSON.stringify(body),
      headers:{
        Accept:"text/plain",
        "Content-Type":"application/json"
      },
      method:"POST"
    }).then(()=>{
      this.state.updateVideoList()
    })
  }

  public updateURL = (url:string) => {
    if(this.state.playingUrl === url){
      this.setState({playingUrl:""},()=>this.setState({playingUrl:url}))
    }else{
      this.setState({playingUrl:url})
    }
  }

  public videoList = (callback:any) => {
    this.setState({updateVideoList:callback})
  }


  public render() {
    return (<div>
      <Header addVideo={this.addVideo} />
      <div className="container">
        <div className="row">
          <div className="col-7">
            <ReactPlayer
              className="player"
              controls={true}
              url={this.state.playingUrl}
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
            <VideoList play = {this.updateURL} mount={this.videoList}/>
          </div>
        </div>
        <CaptionArea play={this.updateURL} currentVideo={this.state.playingUrl}/>
      </div>
    </div>)
  }
}

export default App;