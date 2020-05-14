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
    }
}
