using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace DAL
{
    public class ProjectDal : IProjectDal
    {
        public void AddProject(Project project)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Project.Add(project);
                db.SaveChanges();
            }
        }
    }
}
