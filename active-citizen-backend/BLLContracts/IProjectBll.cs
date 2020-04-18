using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLLContracts
{
    public interface IProjectBll
    {
        void LoadProject(Project project);
        IEnumerable<Project> GetAll();
        Project GetById(int id);
        bool UpdateProject(Project project);
        bool DeleteProject(int id);
        bool Participate(Participating participating);
        bool IsParticipate(Participating participating);
        ProjectDirection GetDirection(int id);
        bool AddIdea(DirectionIdea idea);
        IEnumerable<DirectionIdea> GetAllIdeas(int id);
        bool UpdateIdea(DirectionIdea idea);
    }
}
