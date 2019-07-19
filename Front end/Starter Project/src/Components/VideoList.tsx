import Close from '@material-ui/icons/Close'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'

interface IState{
    videoList:any
}

interface IProps{
    play:any,
    mount:any,
}

export default class VideoList extends React.Component<IProps,IState>{
    public constructor(props:any){
        super(props);
        this.state = {
            videoList: [],
        }
        this.updateList();
    }

    public componentDidMount = () =>{
        this.props.mount(this.updateList)
    }

    public updateList = () => {
        fetch('https://scriberapi.azurewebsites.net/api/Videos',{
            method:'GET'
        }).then((response:any) => {
            return response.json();
        }).then((response:any)=>{
            const output:any[] = []
            response.forEach((video:any) => {
                const row = (<tr>
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star/>:<StarBorder/>}</td>
                    <td className="align-middle" onClick={() => this.props.play(video.webUrl)}><img src={video.thumbnailUrl} width="100px"/></td>
                    <td className="align-middle" onClick={() => this.props.play(video.webUrl)}>{video.videoTitle}</td>
                    <td className="align-middle" onClick={() => this.deleteVideo(video.videoId)}><Close/></td>                    
                    </tr>)
                if(video.isFavourite){
                    output.unshift(row);
                }else{
                    output.push(row);
                }
            })
            this.setState({videoList:output})
            });
    }

    public deleteVideo = (id:any) => {
        fetch("https://scriberapi.azurewebsites.net/api/Videos/"+id,{
            method:"DELETE"
        }).then(()=>{
            this.updateList()
        })
    }

    public handleLike = (video:any) =>{
        const toSend = [{
            "from":"",
            "op":"replace",
            "path":"/isFavourite",
            "value":!video.isFavourite,
        }]
        fetch("https://scriberapi.azurewebsites.net/api/Videos/update/"+video.videoId,{
            body:JSON.stringify(toSend),
            headers: {
                Accept: "text/plain",
                "Content-Type":"application/json-patch+json"
            },
            method:"PATCH"
        }).then(()=>{this.updateList()})
    }

    public render() {
        return (
            <div className="video-list">
            <h1 className="play-heading"><span className="red-heading">play</span>video</h1>
            <table className="table">
                {this.state.videoList}
            </table>
            </div>
        )
    }
}