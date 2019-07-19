import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import AddCircle from '@material-ui/icons/AddCircle'
import * as React from 'react';

interface IProps{
    addVideo:any,
}

interface IState{
    input:string
}

export default class Header extends React.Component<IProps,IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
        }
    }

    public addVideo = () =>{            
        this.props.addVideo(this.state.input)
    }

    public render() {
        return (
            <div className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-2 justify-content-center align-self-center">
                            <h1><span className="red-heading">Like</span>&amp;Scribr</h1>
                        </div>
                        <div className="col-10">
                            <TextField
                            id= "Search-Bar"
                            className = "SearchBar"
                            placeholder="Add Video Url"
                            margin="normal"
                            variant="outlined"
                            onChange = { (event: any ) => this.setState({input:event.target.value})}
                            value = {this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={this.addVideo}>
                                        <AddCircle/>
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
