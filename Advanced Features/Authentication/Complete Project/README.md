# NZMSA 2019 Phase-2 Frontend - Scribr

Note: This documentation is probably not going to be everything which is covered. All of the code will be properly covered in the in-person workshop, with a link to the recording being available at a later date.

## Contents
1.  [__Before You Start__](#1.-before-you-start)
2. [__Starter Project Overview__](#2.-starter-project-overview)



# 1. Before You Start

Before you start coding away, take a moment to have a look through this section of the repo. You'll notice that there are two folders - 'Starter Project' and 'Completed Project'. If you want to see what the final output will look like or have any issues following this documentation, go ahead and npm install then npm start inside that folder.

In the starter code, the structure, styling and basic functions have all been provided (otherwise this document would be massive!). Since you should all be familiar with React js, we'll be focusing on consuming the API for all of the CRUD (Create, Read, Update, Delete) operations. Specifically, they are:

- CREATE: Uploading a video (POST)
- READ: Retrieving all the videos and captions (GET)
- UPDATE: Liking a video (adding it to your favourites) (PUT)
- DELETE: Deleting a video (DELETE)

We will also be taking a look at some of the slightly more complex features which have been used in this project.

Before you proceed, make sure you download / clone the starter project and `npm install` (this might take some time). We'll be building on this project!

# 2. Starter Project Overview

In the project you'll want to take a look at a few files

- `App.tsx` which provides the structure for the components and handles the rendering of the rest of the components.

- `VideoList.tsx` Provides the side list which contains all the videos that have been transcribed

- `CaptionArea.tsx` Provides the area where we can display all the searched captions

- `Header.tsx` The header component which contains the text input for adding videos

- `index.css` and `App.css ` Contains the styling for components which we will be using

# 3. Video List
## 3.1 Get all the videos
We will need to populate our list of videos with the videos which we have currently got transcribed to do this we need to make a GET request. To do this we need to make a call to the `https://msascribrapi.azurewebsites.net/api/Videos`.

To do so lets add some code to the update list method. But first we need to know what response we will be expecting we can use the inbuilt postman tool at `https://msascribrapi.azurewebsites.net/` to see what the response from the API will look like.

```JSON
[
  {
    "videoId": 32,
    "videoTitle": "Marketing to Doctors: Last Week Tonight with John Oliver (HBO)",
    "videoLength": 1033,
    "webUrl": "https://www.youtube.com/watch?v=YQZ2UeOTO3I",
    "thumbnailUrl": "https://i.ytimg.com/vi/YQZ2UeOTO3I/mqdefault.jpg",
    "isFavourite": true,
    "transcription": []
  },
  {
    "videoId": 34,
    "videoTitle": "CS50 2018 - Lecture 0 - Computational Thinking, Scratch",
    "videoLength": 4235,
    "webUrl": "https://www.youtube.com/watch?v=5azaK2cBKGw",
    "thumbnailUrl": "https://i.ytimg.com/vi/5azaK2cBKGw/mqdefault.jpg",
    "isFavourite": true,
    "transcription": []
  }
]
```

We now know that we need to loop over the array that is provided and each object within this represents a different video. We should therefore be rendering a different table item for every object. So we can go ahead and start coding the function `updateList()` in `VideoList.tsx`

```javascript
        fetch('https://msascribrapi.azurewebsites.net/api/Videos',{
            method:'GET'
        }).then((ret:any) => {
            return ret.json();
        }).then((result:any) => {
            const output:any[] = []
            result.forEach((video:any) => {
                const row = (<tr>
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star/>:<StarBorder/>}</td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl)}><img src={video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>
                    <td className="align-middle" onClick={() => this.playVideo(video.webUrl)}><b>{video.videoTitle}</b></td>
                    <td className="align-middle video-list-close"><button onClick={() => this.deleteVideo(video.videoId)}><Close/></button></td>
                </tr>)
                if(video.isFavourite){
                    output.unshift(row);
                }else{
                    output.push(row);
                }
            });
            this.setState({videoList:output})
        })
```

In this code we first perform a GET requeest via the fetch api. Then we convert the response into a json object. Then for every video in the object we map this to a Row in our Video List. After we make our table row we need to add it to our output array. However it looks better if we have the videos that are favourited appearing at the start of the video list. To do this we can use the inbuilt array methods of unshift and push. Push will append the item to the end of the array however the unshift method puts the item at the beginning of the array. So if the video is favourited we want to put it at the start so we use unshift.

Just to note that we don't need to do a bind operation since the arrow functions are automatically bound to the component for us.

## 3.2 Handling Liking of Videos

To handle the liking of videos we need to make an update to the video. Looking at our API at `https://msascribrapi.azurewebsites.net/` we will need to use the Patch Request for videos. This is under `https://msascribrapi.azurewebsites.net/api/Videos/Update/{id}` for this request we need to replace {id} with the id of the video that we are looking to update. This api call requires an array to be passed in which contains an object. It requires a few key value pairs which will be, `from` which we can leave blank. It requires what operation which is under `op` which will be replace for us. It also requires the `path` of the variable we want to change and the `value` of the update variable.

So lets begin by adding the following code to the `handleLike()` function in the `VideoList.tsx` file. 

```typescript
public handleLike = (video:any) => {
    const toSend = [{
        "from":"",
        "op":"replace",
        "path":"/isFavourite",
        "value":!video.isFavourite,
    }]
    fetch("https://msascribrapi.azurewebsites.net/api/Videos/update/"+video.videoId, {
        body:JSON.stringify(toSend),
        headers: {
            Accept: "text/plain",
            "Content-Type": "application/json-patch+json"
        },
        method: "PATCH"
        }).then(() => {
            this.updateList();
        })
}
```
This code is first building the JSON object which we need to send as a payload in the body of the request. To send the JSON object we need to first convert it into a string which can be done by the `JSON.stringfy()` method. Then when a response is received we can attempt to update the list by calling the method which was previously created.


## 3.3 Deleting Videos

Finally we want to be able to give users a chance to delete Videos which they have created. This is done via the delete operation which for us is under the api section `https://msascribrapi.azurewebsites.net/api/Videos/{id}` where we will need to replace the id with the id of the video that we want to delete.

To make this request all we need to add to the `deleteVideo` function in the `VideoList.tsx` file is the following code

```typescript
    fetch("https://msascribrapi.azurewebsites.net/api/Videos/"+id,{
        method:'DELETE'
    }).then(() => {
        this.updateList()
    })
```
The code firstly makes the request to the API and then when the request is completed we will need to re-render our list to keep it up to date with whats in our database on the API side.

# 4. Caption Area
## 4.1 Getting Transcriptions By Search Tag

To implement our Search Functionality we need to implement an API request which will return to us the transcriptions which match our search string. To do this we will need to make a call to the endpoint `https://msascribrapi.azurewebsites.net/api/Videos/SearchByTranscriptions/{search_string}`. We need to replace search string with our api request.

Lets add the following code to our `search` function in the `CaptionArea.tsx` file.

```typescript
        if(this.state.input.trim() === ""){
            this.setState({result:[]},()=>this.makeTableBody())
        }else{
            fetch("https://msascribrapi.azurewebsites.net/api/Videos/SearchByTranscriptions/"+this.state.input, {
                headers: {
                  Accept: "text/plain"
                },
                method:"GET"
            }).then(response => {
                return response.json()
            }).then(answer => {
                this.setState({result:answer},()=>this.makeTableBody())
            })
        }
```

This function first checks if our input is an empty which means that there is no search string in which case we can set our result to be the empty array since it was an invalid search. If there is something valid then we use the fetch api to make a get request to our API. We then read in the response as a JSON and when that is completed we can set the result in our state to the return value. The syntax you see in set state is passing a callback function which will be called once the state has been set. This will make a call to makeTableBody which is what we will implement next.

## 4.2 Make Table Body
The next thing which we need to implement is the conversion from the API result to our table which we are then able to view.

So lets add the following code to our MakeTableBody Function within the `CaptionArea.tsx` file.

```typescript
        const toRet: any[] = [];
        this.state.result.sort((a:any, b:any)=>{
            if(a.webUrl === b.webUrl){
                return 0;
            }else if(a.webUrl === this.props.currentVideo){
                return -1;
            }else if(b.webUrl === this.props.currentVideo){
                return 1;
            }
            else{
                return a.videoTitle.localeCompare(b.videoTitle);
            }
        })
        this.state.result.forEach((video: any) => {
            video.transcription.forEach((caption: any) => {
                toRet.push(
                    <tr onClick={() => this.handleTableClick(video.webUrl,caption.startTime)}>
                        <td>{caption.startTime}</td>
                        <td>{caption.phrase}</td>
                        <td>{video.videoTitle}</td>
                    </tr>)
            })
        });
        if (toRet.length === 0) {
            if(this.state.input.trim() === ""){
                const errorCase = <div><p>Sorry you need to still search</p></div>
                this.setState({body:errorCase})
            }else{
                const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
                this.setState({body:errorCase})
            }
        }
        else{
            this.setState({body:toRet})
        }
```
The first thing this code will do is sort the result of the API call which is stored in result within our state. The sorting function works as follows it takes in a function which has two parameters (a,b) [note that they dont have to be called a,b could be anything]. If you want a to come before b you return -1, if you want b before a return 1, if you return 0 they remain in the same order. Here what we are doing is first if the url's of the videos are the same meaning the same video we can return 0. Otherwise we want to do the video which is currently playing to be shown at the top so we can compare it to the currently playing URL and return -1 or 1 respectively. For all other cases we use the localeCompare method to just compare alphabetically the two A,B titles.

The second thing which is being done is we take the sorted array and we generate our table body now by mapping each item in the array to a row in our table body. Looking at the JSON for the return from the API below we see that each video has an array of transcripts.

```JSON
[
  {
    "videoId": 58,
    "videoTitle": "9 Spokes Experience | Microsoft Student Accelerator #MSA",
    "videoLength": 150,
    "webUrl": "https://www.youtube.com/watch?v=KBIWVVHNzTY",
    "thumbnailUrl": "https://i.ytimg.com/vi/KBIWVVHNzTY/mqdefault.jpg",
    "isFavourite": true,
    "transcription": [
      {
        "transcriptionId": 10886,
        "videoId": 58,
        "startTime": 13,
        "phrase": "manager we got introduced to the MSA",
        "video": null
      }
    ]
  },
  {
    "videoId": 95,
    "videoTitle": "\"Try not to laugh challenge ??\"  - Cognitive Services | Microsoft Azure",
    "videoLength": 2408,
    "webUrl": "https://www.youtube.com/watch?v=5OS_J_mfNYI",
    "thumbnailUrl": "https://i.ytimg.com/vi/5OS_J_mfNYI/mqdefault.jpg",
    "isFavourite": true,
    "transcription": [
      {
        "transcriptionId": 17338,
        "videoId": 95,
        "startTime": 0,
        "phrase": "hey everyone welcome to MSA 2019 my name",
        "video": null
      }
    ]
  }
]
```

From this we can see that we need to loop over every video and every transcript for each of the videos and will need to create a table  row for this.

Finally we just check incase nothing is in the return array and append the appropriate error message.

# 5. Main App
## 5.1 Adding Videos
We need to be able to handle users adding videos as well. So to achieve this we need to add a function which will make a post request to the API with the URL of the video which we have added. You will notice that the input field for the adding of video however is in the Header component. To get the URL to the main app screen we pass in the AddVideo function to our header component as a prop and then when the add video button is clicked we pass in the url as the parameter to this function.

So lets get to coding up the `AddVideo` function now.

```typescript
    const body = {"url": url}
    fetch("https://msascribrapi.azurewebsites.net/api/Videos", {
      body: JSON.stringify(body),
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(() => {
      this.state.updateVideoList();
    })
```

The way this code works is first we create our body object which we will be sending to the API. The only required field the API requires is `"url"` which is the url of the video that we want to add. We then make the request to the api at `https://msascribrapi.azurewebsites.net/api/Videos`. We need to pass the body to the API as a string so we can use the inbuilt `JSON.stringfy` method to do this. Finally we are making a post request to the API as we are sending data to it. 

When we get a response from the API we should update the our video list to more explain how this works we first will take a look at a method in the `VideoList` file called     `componentDidMount` 

```typescript
    public componentDidMount = () => {
        this.props.mount(this.updateList)
        this.updateList()
    }
```

This is passing a reference to the updateList function from within the videoList component so that we can call that function from the App component. The function mount is a prop and is actually using the App files `listMounted` function which simply sets the reference to the `updateVideoList` field in the state. When we have the reference to the function we can call it by doing `this.state.updateVideoList()`.

# Now we are done with the basic application you can add advanced features.
