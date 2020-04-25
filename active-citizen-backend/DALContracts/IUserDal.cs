using System;
using Common.Entities;

namespace DALContracts
{
    public interface IUserDal
    {
        Users GetUserByEmail(string email);
        void AddUser(Users user);
        Users GetUserById(int id);
    }
}
