using Common.Entities;
using DALContracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DAL
{
    public class ProjectDal : IProjectDal
    {
        private IUserDal _userDal;

        public ProjectDal(IUserDal userDal)
        {
            _userDal = userDal;
        }
        public void AddProject(Project project)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Project.Add(project);
                db.SaveChanges();
            }
        }

        public IEnumerable<Project> GetAll()
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Project.ToList();
            }
        }

        public Project GetById(int id)
        {
            using(var db = new ActiveCitizenContext())
            {
                return db.Project.Where(p => p.Id == id)
                    .Include("ProjectDirection.DirectionIdea.User")
                    .Include("ProjectDirection.DirectionIdea.IdeaComment.User")
                    .FirstOrDefault();
            }
        }

        public bool UpdateProject(Project project)
        {
            using(var db = new ActiveCitizenContext())
            {
                db.Entry(db.Project.Find(project.Id)).CurrentValues.SetValues(project);
                return db.SaveChanges() > 0;
            }
        }

        public bool DeleteProject(int id)
        {
            using(var db = new ActiveCitizenContext())
            {
                db.Project.Remove(db.Project.Find(id));
                return db.SaveChanges() > 0;
            }
        }

        public bool Participate(Participating participating)
        {
            using(var db = new ActiveCitizenContext())
            {

                db.Participating.Add(participating);
                var project = db.Project.FirstOrDefault(p => p.Id == participating.ProjectId);
                if (project != null)
                {
                    project.ParticipantsCount++;
                }
                return db.SaveChanges() > 1;
            }
        }

        public bool IsParticipate(Participating participating)
        {
            using(var db = new ActiveCitizenContext())
            {
                return db.Participating.FirstOrDefault(p => p.UserId == participating.UserId && p.ProjectId == participating.ProjectId) != null;
            }
        }

        public bool AddDirection(ProjectDirection direction)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.ProjectDirection.Add(direction);
                return db.SaveChanges() > 0;
            }
        }

        public bool DeleteDirection(ProjectDirection direction)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Remove(db.ProjectDirection.Find(direction.Id));
                return db.SaveChanges() > 0;
            }
        }

        public bool UpdateDirection(ProjectDirection direction)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Entry(db.ProjectDirection.Find(direction.Id)).CurrentValues.SetValues(direction);
                return db.SaveChanges() > 0;
            }
        }

        public ProjectDirection GetDirection(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.ProjectDirection.Where(d => d.Id == id)
                    .Include("DirectionIdea.User")
                    .Include("Project")
                    .FirstOrDefault();
            }
        }

        public bool AddIdea(DirectionIdea idea)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.DirectionIdea.Add(idea);
                var direction = db.ProjectDirection.Find(idea.DirectionId);
                db.Project.Find(direction.ProjectId).IdeasCount++;
                db.ProjectDirection.Find(idea.DirectionId).CountOfIdeas++;
                return db.SaveChanges() > 2;
            }
        }

        public IEnumerable<DirectionIdea> GetAllIdeas(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.DirectionIdea.Where(i => i.DirectionId == id)
                    .Include("User")
                    .ToList();
            }
        }

        public bool UpdateIdea(DirectionIdea idea)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Entry(db.DirectionIdea.Find(idea.Id)).CurrentValues.SetValues(idea);
                //if (idea.Status == 1)
                //{
                //    db.ProjectDirection.Find(idea.DirectionId).CountOfIdeas++;
                //    return db.SaveChanges() > 1;
                //}
                return db.SaveChanges() > 0;
            }
        }

        public DirectionIdea GetIdeaById(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.DirectionIdea.Where(i => i.Id == id)
                    .Include("Direction.Project")
                    .Include("User")
                    .Include("IdeaComment.User")
                    .FirstOrDefault();
            }
        }

        public bool VoteForIdea(Voting voting)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Voting.Add(voting);
                db.DirectionIdea.Find(voting.IdeaId).VotesCount++;
                return db.SaveChanges() > 1;
            }
        }

        public bool IsUserVoted(Voting voting)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Voting.FirstOrDefault(v => v.UserId == voting.UserId && v.IdeaId == voting.IdeaId) != null;
            }
        }

        public bool AddComment(IdeaComment comment)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.IdeaComment.Add(comment);
                db.DirectionIdea.Find(comment.IdeaId).CountOfComments++;
                return db.SaveChanges() > 1;
            }
        }

        public IdeaComment GetCommentById(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.IdeaComment.Find(id);
            }
        }

        public List<Participating> GetParticipants(int projectId)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Participating.Where(p => p.ProjectId == projectId).ToList();
            }
        }

        public bool RealiseIdea(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.DirectionIdea.Find(id).IsRealised = true;
                return db.SaveChanges() > 0;
            }
        }

        public bool DeleteComment(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                var comment = db.IdeaComment.Find(id);
                db.DirectionIdea.Find(comment.IdeaId).CountOfComments--;
                db.IdeaComment.Remove(comment);
                return db.SaveChanges() > 0;
            }
        }

        public IEnumerable<Users> GetProjectParticipants(int projectId)
        {
            using (var db = new ActiveCitizenContext())
            {
                List<Users> users = new List<Users>();
                var participations = db.Participating.Where(p => p.ProjectId == projectId).ToList();
                foreach (var p in participations)
                {
                    users.Add(_userDal.GetUserById(p.UserId));
                }

                return users;
            }
        }

        public IEnumerable<DirectionIdea> GetUserIdeas(int userId)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.DirectionIdea.Where(i => i.UserId == userId).ToList();
            }
        }
    }
}
