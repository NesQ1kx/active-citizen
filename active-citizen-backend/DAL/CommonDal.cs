using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DAL
{
    public class CommonDal : ICommonDal
    {
        public bool AddNews(News news)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.News.Add(news);
                return db.SaveChanges() > 0;
            }
        }

        public IEnumerable<News> GetAllNews()
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.News.ToList();
            }
        }

        public News GetNewsById(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.News.Find(id);
            }
        }

        public bool DeleteNews(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.News.Remove(db.News.Find(id));
                return db.SaveChanges() > 0;
            }
        }

        public bool EditNews(News news)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Entry(db.News.Find(news.Id)).CurrentValues.SetValues(news);
                return db.SaveChanges() > 0;
            }
        }
    }
}
