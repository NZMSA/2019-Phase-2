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
      //Update the videolist
    })
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
            <VideoList play = {}
          </div>
        </div>
        {/* */}
      </div>
    </div>)
  }
}

export default App;