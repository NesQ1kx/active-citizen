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
    }
}
