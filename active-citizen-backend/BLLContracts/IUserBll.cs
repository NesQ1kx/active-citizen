using Common.Entities;
using System;

namespace BLLContracts
{
    public interface IUserBll
    {
        bool CheckUserUniqueness(string email);
        void AddUser(Users user);
        string HashPassword(string password);
        Users GetUserByEmail(string email);
        bool VerifyUser(string email, string password);
    }

}
