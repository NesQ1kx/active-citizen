using BLLContracts;
using Common.Entities;
using DALContracts;
using System;
using System.Security.Cryptography;
using System.Text;

namespace BLL
{
    public class UserBll : IUserBll
    {
        private IUserDal _userDal;

        public UserBll(IUserDal userDal)
        {
            _userDal = userDal;
        }

        public bool CheckUserUniqueness(string email)
        {
            var user = _userDal.GetUserByEmail(email);
            return user == null;
        }

        public void AddUser(Users user)
        {
            _userDal.AddUser(user);
        }

        public string HashPassword(string password)
        {
            var md5 = MD5.Create();
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(password));

            return Convert.ToBase64String(hash);
        }

        public Users GetUserByEmail(string email)
        {
            return _userDal.GetUserByEmail(email);
        }

        public bool VerifyUser(string email, string password)
        {
            var user = _userDal.GetUserByEmail(email);
            return HashPassword(password) == user.Password;
        }
    }
}
