using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLLContracts
{
    public interface ICommonBll
    {
        bool AddNews(News news);
        IEnumerable<News> GetAllNews();
        News GetNewsById(int id);
        bool DeleteNews(int id);
        bool EditNews(News news);
    }
}
