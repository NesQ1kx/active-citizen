using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DALContracts
{
    public interface IProjectDal
    {
        void AddProject(Project project);
    }
}
