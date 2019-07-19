import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'

interface IState{
    videoList:any
}

interface IProps{
    play:any
}

export default class VideoList extends React.Component<IProps,IState>{
    public constructor(props:any){
        super(props);
        this.state = {
            videoList: [],
        }
    }

    public updateList = () => {
        fetch('https://scriberapi.azurewebsites.net/api/Videos',{
            method:'GET'
        }).then((response:any) => {
            return response.json();
        }).then((response:any)=>{
            const output:any[] = []
            response.forEach(video => {
                const row = (<tr>
                    <td onClick={/** handle like */}>{video.isFavourite === true?<Star/>:<StarBorder/>}</td>
                    <td onClick={() => this.props.play(video.webUrl)}><img src={video.thumbnailUrl}/></td>
                    <td onClick={() => this.props.play(video.webUrl)}>{video.videoTitle}</td>
                    <td onClick={() => this.deleteVideo(video.videoId)}><Close/></td>                    
                    </tr>
                    }
                </tr>)
            });
        })
    }

    public render() {
        return (
            <div className="video-list">

            </div>
        )
    }
}