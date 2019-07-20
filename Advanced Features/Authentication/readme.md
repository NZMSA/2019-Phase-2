# Facial Login using Custom Vision Model

## Overview

![CustomVision](./img/CustomVision.PNG)

After we have done all the core features for our application, we are now good to create facial login as an advanced feature. With Microsoft cognitive services, specifically Microsoft Azure custom vision service we can create a basic facial recognition authentication to login our web application.

This tutorial will walk you through:

1. Setup custom vision project and train the classifier
2. Integrate Camera
3. Integrate custom vision model into facial-login feature
4. References

## 1. Setup custom vision project and train the classifier

Firstly, navigate to: https://www.customvision.ai/ and sign in with your Azure account (with your Azure subscription) and click on `NEW PROJECT` to create a new project.

Enter your project name and description and choose your Resource Group. If you don't have one then you need to `create new`.

![NewProject](./img/NewProject.png)

![NewResource](./img/NewResource.png)

Then go ahead and upload a few selfies of yourself and potentially your friends.
Tag the photos with the name of the person. The API will return the result of that person's name.

Hit the button `Train` at the top right corner to train the model. The more selfies that you have per tag, the more precise the model will be.

![APItrain](./img/APItrain.jpg)

Click on `Prediction URL` and copy down the URL, Prediction-Key, and Content-Type under the `image file` section. You will need this when integrating custom vision model into facial-login feature of your application.

![predictionURL](./img/predictionURL.jpg)

## 2. Integrate Camera
### Setup
To setup, we will use the `react-webcam` package available on npm.

In your repository, PowerShell or Command Prompt, navigate to your Project's main folder and enter the following command to install the `react-webcam`

`npm install react-webcam`    

Install TypeScript type definition support for react-webcam.

`npm install @types/react-webcam`

Then we can now import webcam at the top of our App.tsx and use the component

```javascript
//  import Webcam
import * as Webcam from "react-webcam";
```

### Add Camera: in App.tsx

We will add a state for camera to the `interface IState`
* `refCamera: any`    
This stores a reference pointer to the camera, allow us to invoke the method getScreenShot() later

```javascript
// add new state to App.tsx states interface.

interface IState {
    updateVideoList: any,
    player: any,
    playingURL: string
    videoList: object,
    refCamera: any
}
```

And set the added state within the constructor:

```javascript
class App extends React.Component<{}, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            player: null,
            playingURL: "",
            updateVideoList: null,
            videoList: [],
            refCamera: React.createRef(),
        }
    }
```

Then we will add the camera on top of our application

```javascript
public render() {
        return (<div>

            <div>
                <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    ref={this.state.refCamera}
                />
            </div>

```

Now run `npm start` in your Command Prompt to see the webcam appear at the top of our application.

***Note:*** If it shows error : "The key 'authenticated' is not sorted alphabetically tsconfig", add the following rule inside tslint.json file, under "rules":

```javascript
"object-literal-sort-keys": false
```

## 3. Integrate Custom Vision Model Into Facial-login Feature

We will now move to integrating facial authentication login into our application. Add another two states for authenticating:
* `authenticated: boolean`    
This represents the state whether the user is authenticated or not.
* `predictionResult: any`    
This represents the result when we call the Facial API, we will set if this value is larger than 0.7, which is 70%, we will login successfully and show the application.

```javascript
interface IState {
    updateVideoList: any,
    player: any,
    playingURL: string
    videoList: object,
    authenticated: boolean,
    refCamera: any,
    predictionResult: any
}
```

Similarly, set the added states within the constructor and remember to bind your method to the state.

```javascript
class App extends React.Component<{}, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            player: null,
            playingURL: "",
            updateVideoList: null,
            videoList: [],
            authenticated: false,
            refCamera: React.createRef(),
            predictionResult: null
        }

        this.authenticate = this.authenticate.bind(this)

    }
```

Next we set that the camera will show when the user hasn't been authenticated. Wrap the block of code for rendering camera that we have just done in step 2 with the condition of not-authenticated as `(!authenticated)`, as following

```javascript
public render() {

        const { authenticated } = this.state

        return (<div>

            <div>
                {(!authenticated) ?
                    <div>
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={this.state.refCamera}
                        />
                        <div className="row nav-row">
                            <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
                        </div>
                    </div>
                    : ""}
```

The camera will now be rendered only when it has not been authenticated yet.

Follow with the block of code above, we will now set the conditional statement to render the application when `authenticated` value is True, which means the user has logged in successfully.

Wrap the block of code for the main app with `(authenticated)` as below:

```javascript
public render() {

        const { authenticated } = this.state

        return (<div>

            <div>
                {(!authenticated) ?
                    <div>
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={this.state.refCamera}
                        />
                        <div className="row nav-row">
                            <div className="btn btn-primary bottom-button" onClick={this.authenticate}>Login</div>
                        </div>
                    </div>
                    : ""}


                {(authenticated) ?
                    <div>
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
                    </div>
                    : ""}

            </div>

        </div>)
    }
```

### Implementing API

Next we will implement an API call method to our custom vision model project endpoint.

In `getFaceRecognitionResult(image: string)` method, we have conditional statements that if the prediction value returns is above 70% (0.7), it will set the state of `authenticated` equals to `true`.

Coming back to the step 1, enter the values that you have saved: the URL as `[API-ENDPOINT]`, Prediction Key as `[API-KEY]`, and Content-Type as `'application/octet-stream'`


```javascript
// Call custom vision model
    private getFaceRecognitionResult(image: string) {
        const url = "[API-ENDPOINT]"
        if (image === null) {
            return;
        }
        const base64 = require('base64-js');
        const base64content = image.split(";")[1].split(",")[1]
        const byteArray = base64.toByteArray(base64content);
        fetch(url, {
            body: byteArray,
            headers: {
                'cache-control': 'no-cache', 'Prediction-Key': '[API-KEY]', 'Content-Type': 'application/octet-stream'
            },
            method: 'POST'
        })
            .then((response: any) => {
                if (!response.ok) {
                    // Error State
                    alert(response.statusText)
                } else {
                    response.json().then((json: any) => {
                        console.log(json.predictions[0])

                        this.setState({ predictionResult: json.predictions[0] })
                        if (this.state.predictionResult.probability > 0.7) {
                            this.setState({ authenticated: true })
                        } else {
                            this.setState({ authenticated: false })
                            console.log(json.predictions[0].tagName)
                        }
                    })
                }
            })
    }
```

### Implement authenticate method.

In this method, we will get an selfie through the camera object `refCamera` that we have added before by calling `getScreenshot()` method. The Invoke getScreenshot() returns a Base64-encoded image and we will pass it in the `getFaceRecognitionResult()` method as a parameter.

```javascript
// Authenticate
    private authenticate() {
        const screenshot = this.state.refCamera.current.getScreenshot();
        this.getFaceRecognitionResult(screenshot);
    }
```

Here, when we run the application, the `authenticated` is initially set to `false`, the camera component will be rendered. Then it will check whether the user matches any tags in our custom vision model. If it matches, we set the state of `authenticated` to `true` and then the page will now render our application.

Now test running your application.

## 4. References:

* [Custom Vision Service](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier)
* [React-Webcam](https://www.npmjs.com/package/react-webcam)
