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
