using BLLContracts;
using Common.Comparers;
using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BLL
{
    public class ProjectBll : IProjectBll
    {
        IProjectDal _projectDal;
        public ProjectBll(IProjectDal projectDal)
        {
            _projectDal = projectDal;
        }
        public void LoadProject(Project project)
        {
            _projectDal.AddProject(project);
        }

        public IEnumerable<Project> GetAll()
        {
            return _projectDal.GetAll();
        }

        public Project GetById(int id)
        {
            return _projectDal.GetById(id);
        }

        public bool UpdateProject(Project project)
        {
            foreach (var d in project.ProjectDirection)
            {
                if (d.Id == 0)
                {
                    d.ProjectId = project.Id;
                    _projectDal.AddDirection(d);
                }
            }


            var prevProject = _projectDal.GetById(project.Id);
            
            if (project.ProjectDirection.Count != prevProject.ProjectDirection.Count)
            {
                var except = prevProject.ProjectDirection.Except(project.ProjectDirection, new DirectionComparer());
                foreach (var d in except)
                {
                    _projectDal.DeleteDirection(d);
                }
            } else
            {
                foreach (var d in project.ProjectDirection)
                {
                    _projectDal.UpdateDirection(d);
                }
            }

            _projectDal.UpdateProject(project);
            return true;
        }

        public bool DeleteProject(int id)
        {
            return _projectDal.DeleteProject(id);
        }
        public bool Participate(Participating participating)
        {
            return _projectDal.Participate(participating);
        }
        public bool IsParticipate(Participating participating)
        {
            return _projectDal.IsParticipate(participating);
        }
    }
}
