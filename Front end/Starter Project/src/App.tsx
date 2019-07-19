import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'

interface IState {

}

class App extends React.Component<{}, IState>{
  public constructor(props: any) {
    super(props);
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
            {/* */}
          </div>
        </div>
        {/* */}
      </div>
    </div>)
  }
}

export default App;