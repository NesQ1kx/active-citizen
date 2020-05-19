using BLLContracts;
using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL
{
    public class CommonBll : ICommonBll
    {
        ICommonDal _commonDal;
        public CommonBll(ICommonDal commonDal)
        {
            _commonDal = commonDal;
        }

        public bool AddNews(News news)
        {
            return _commonDal.AddNews(news);
        }

        public IEnumerable<News> GetAllNews()
        {
            return _commonDal.GetAllNews();
        }

        public News GetNewsById(int id)
        {
            return _commonDal.GetNewsById(id);
        }

        public bool DeleteNews(int id)
        {
            return _commonDal.DeleteNews(id);
        }

        public bool EditNews(News news)
        {
            return _commonDal.EditNews(news);
        }
    }
}
