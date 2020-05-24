using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DALContracts
{
    public interface IProjectDal
    {
        void AddProject(Project project);
        IEnumerable<Project> GetAll();
        Project GetById(int id);
        bool UpdateProject(Project project);
        bool DeleteProject(int id);
        bool Participate(Participating participating);
        bool IsParticipate(Participating participating);
        bool AddDirection(ProjectDirection direction);
        bool DeleteDirection(ProjectDirection direction);
        bool UpdateDirection(ProjectDirection direction);
        ProjectDirection GetDirection(int id);
        bool AddIdea(DirectionIdea idea);
        IEnumerable<DirectionIdea> GetAllIdeas(int id);
        bool UpdateIdea(DirectionIdea idea);
        DirectionIdea GetIdeaById(int id);
        bool VoteForIdea(Voting voting);
        bool IsUserVoted(Voting voting);
        bool AddComment(IdeaComment comment);
        IdeaComment GetCommentById(int id);
        List<Participating> GetParticipants(int projectId);
        bool RealiseIdea(int id);
        bool DeleteComment(int id);
        IEnumerable<Users> GetProjectParticipants(int porjectId);
        IEnumerable<DirectionIdea> GetUserIdeas(int userId);
    }
}
