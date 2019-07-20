# SignalR: Enabling real-time capability with your web application. 


<p align="center">
    <img width="500px" src="imgs/signalr-logo.png" />
    <img width="500px" src="imgs/signalr-uses.png" />
</p>

## Introduction

ASP.NET Core SignalR is an open-source library that simplifies adding real-time web functionality to apps. Real-time web functionality enables server-side code to push content to connected-clients as it happens in real-time. Furthermore, SignalR integrates seemlessly with ASP.NET framework.

**Good candidates for SignalR:**

Apps that require high frequency updates from the server. 

- gaming
- social networks
- voting
- auction
- map
- chat
- alerts, many other apps use notifications.

<p align="center">
    <img width="600px" src="imgs/signalr-diagram.png" />
</p>

SignalR uses WebSocket which enables a bi-directional communication between the browser 
and server. 

📚 Reading: [Real-time ASP.NET with SignalR](https://dotnet.microsoft.com/apps/aspnet/real-time)

The SignalR library is made up of server-side and client-side JavaScript components.

We will implement a *hubs* in our backend ScribrAPI that allows a client (connected-client browser) and server to call methods on each other. Hubs call client-side code by sending messages that contain the name and parameters of the client-side method. The client tries to match the name to a method in the client-side code. When the client finds a match, it calls the method and passes to it the deserialized parameter data.

## Implementing a SignalR Hub

We will implement a CentralHub class in our ScribrAPI project to handle updating all the connected clients when something happens. We will start from the base complete API project. (You can find it under `2. API` folder)

Install `Microsoft.AspNetCore.SignalR;` in the solution NuGet Packages manager.

<p align="center">
    <img width="700px" src="imgs/install-signalr.png" />
</p>

Under your ScribrAPI project, add a new folder called ``CentralHub``, and add a new **C#** class file - ``CentralHub.cs``. import the package by adding:

```C#
using Microsoft.AspNetCore.SignalR;
```

Then make your class inherit from the ``Hub`` class.

Add the following method.

```C#
        public async Task ConnectToHub()
        {
            await Clients.All.SendAsync("A new client connected.");
        }
```

<details>
  <summary><b>Your CentralHub.cs</b></summary>

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ScribrAPI.CentralHub
{
    public class CentralHub : Hub
    {
        public async Task ConnectToHub()
        {
            await Clients.All.SendAsync("Connected");
        }
    }
}
```  
</details>

This ``ConnectToHub()`` method, when called by client, SignalR hub will invoke a JavaScript method name ``Connected`` defined in all currently connected clients browser.

## Implementing a client-side JavaScript.

