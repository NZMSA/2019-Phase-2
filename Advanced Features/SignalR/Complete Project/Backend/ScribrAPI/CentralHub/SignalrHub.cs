using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ScribrAPI.CentralHub
{

    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
    }

    public class SignalrHub : Hub
    {
        public async Task BroadcastMessage()
        {
            await Clients.All.SendAsync("Connect");
        }

        public async Task VideoAdded()
        {
            await Clients.All.SendAsync("UpdateVideoList");
        }

        public async Task DeleteVideo()
        {
            await Clients.All.SendAsync("VideoDeleted");
        }

        public override Task OnConnectedAsync()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            int usersCount = UserHandler.ConnectedIds.Count();
            Clients.All.SendAsync("ShowUserCounts", usersCount);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception ex)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            int usersCount = UserHandler.ConnectedIds.Count();
            Clients.All.SendAsync("ShowUserCounts", usersCount);
            return base.OnDisconnectedAsync(ex);
        }
    }
}
