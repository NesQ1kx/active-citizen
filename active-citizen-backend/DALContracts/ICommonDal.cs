using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DALContracts
{
    public interface ICommonDal
    {
        bool AddNews(News news);
        IEnumerable<News> GetAllNews();
    }
}
