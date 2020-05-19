using System;
using System.Collections.Generic;
using Common.Entities;

namespace DALContracts
{
    public interface IUserDal
    {
        Users GetUserByEmail(string email);
        void AddUser(Users user);
        Users GetUserById(int id);
        bool ConfirmUserEmail(int id);
        bool UpdateUserRole(int userId, int role);
        bool ToggleUserBlock(int userId);
        bool UpdateUserAvatar(int userId, string avatart);
        bool DeleteUserAvatar(int userId);
        bool EditUserProfile(Users user);
        IEnumerable<Users> SearchByEmail(string fragment);
        IEnumerable<Users> SearchByFio(string fragment);

    }
}
