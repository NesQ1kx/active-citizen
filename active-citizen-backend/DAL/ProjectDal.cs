using Common.Entities;
using DALContracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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
                return db.Project.Where(p => p.Id == id).Include("ProjectDirection").FirstOrDefault();
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
                return db.SaveChanges() > 0;
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
                    .FirstOrDefault();
            }
        }

        public bool AddIdea(DirectionIdea idea)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.DirectionIdea.Add(idea);
                return db.SaveChanges() > 0;
            }
        }

        public IEnumerable<DirectionIdea> GetAllIdeas(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.DirectionIdea.Where(i => i.DirectionId == id).Include("User").ToList();
            }
        }

        public bool UpdateIdea(DirectionIdea idea)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Entry(db.DirectionIdea.Find(idea.Id)).CurrentValues.SetValues(idea);
                if (idea.Status == 0)
                {
                    db.ProjectDirection.Find(idea.DirectionId).CountOfIdeas++;
                    return db.SaveChanges() > 1;
                }
                return db.SaveChanges() > 0;
            }
        }
    }
}
