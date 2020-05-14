using active_citizen_backend.ViewModels;
using Common.Entities;
using DALContracts;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend
{
    public class CommentsHub : Hub
    {
        IProjectDal _projectDal;
        IUserDal _userDal;
        public CommentsHub(IProjectDal projectDal, IUserDal userDal)
        {
            _projectDal = projectDal;
            _userDal = userDal;
        }
        public async Task SendComment(IdeaComment comment)
        {
            try
            {
                if (_projectDal.AddComment(comment))
                {
                    var commentToReturn = new
                    {
                        Id = comment.Id,
                        CommentText = comment.CommentText,
                        UserId = comment.UserId,
                        IdeaId = comment.IdeaId,
                        CreateDate = comment.CreateDate,
                        ParrentComment = comment.ParrentComment,
                        User = _userDal.GetUserById(comment.UserId)
                    };
                    await Clients.All.SendAsync("RecieveComment", JsonConvert.SerializeObject(commentToReturn));
                    await Clients.Caller.SendAsync("SuccessfulAdd");
                }
                else
                {
                await Clients.Caller.SendAsync("ErrorWhileAdding", "error");
                }
            } catch (Exception e)
            {
                await Clients.Caller.SendAsync("ErrorWhileAdding", e);
            }
           
        }

        public async Task DeleteComment(DeleteCommentViewModel model)
        {
            try
            {
                if (_projectDal.DeleteComment(model.CommentId))
                {
                    await Clients.All.SendAsync("DeletedComment", JsonConvert.SerializeObject(model));
                    await Clients.Caller.SendAsync("SuccessfullDelete");
                }
            } catch (Exception e)
            {
                await Clients.Caller.SendAsync("ErrorWhileDeleting", e);
            }
        }
    }
}
