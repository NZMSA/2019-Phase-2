import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search'
import * as React from 'react'

interface IState {
    input: string,
    result: any,
    body:any,
}

interface IProps {
    currentVideo:any,
    play: any
}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            input:"",
            result:[],
            body:[],
        }
    }

    public search = () => {
        if(this.state.input.trim() === ""){
            this.setState({result:[]},()=>{/** handle update */})
        }else{
            fetch("https://scriberapi.azurewebsites.net/api/Videos/SearchByTranscriptions/"+this.state.input,{
                headers:{
                    Accept:"text/plain"
                },
                method:"GET"
            }).then((response:any)=>{
                return response.json()
            }).then((response:any)=>{
                this.setState({result:response},()=>this.makeTableBody())
            })
        }
    }

    public render() {
        return (
            <div className="caption-area">
                <div className="caption-area">
                <div className="row">
                    <div className="col-2 justify-content-center align-self-center">
                        <h1><span className="red-heading">search</span>caption</h1>
                    </div>
                    <div className="col-10">
                        
                        <TextField
                            id="Search-Bar"
                            className="SearchBar"
                            placeholder="Search Captions"
                            margin="normal"
                            variant="outlined"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => this.search()}>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </div>
                </div>
                <br/>
                hello
            </div>
        )
    }
}