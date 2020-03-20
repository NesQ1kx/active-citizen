using BLLContracts;
using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
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
    }
}
