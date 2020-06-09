using Common.Entities;
using System;
using System.Collections.Generic;

namespace BLLContracts
{
    public interface IUserBll
    {
        bool CheckUserUniqueness(string email);
        void AddUser(Users user);
        string HashPassword(string password);
        Users GetUserByEmail(string email);
        bool VerifyUser(string email, string password);
        Users GetUserById(int id);
        void SendConfirmationEmail(string email);
        string GenerateToken(string email);
        string GetEmailFromToken(string token);
        bool ConfirmUserEmail(int id);
        void NotifyAboutProjectStart(int projectId);
        bool UpdateUserRole(int userId, int role);
        bool ToggleUserBlock(int userId);
        bool UpdateUserAvatar(int userId, string avatar);
        bool DeleteUserAvatar(int userId);
        bool EditUserProfile(Users user);
        IEnumerable<Users> SearchByEmail(string fragment);
        IEnumerable<Users> SearchByFio(string fragment);
        bool ChangePassword(string email, string password);
        void SendResetRequest(string email);
        bool IsSnilsUnique(long snils);
    }

}
