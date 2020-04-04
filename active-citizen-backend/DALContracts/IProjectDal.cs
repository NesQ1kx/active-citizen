using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

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
    }
}
