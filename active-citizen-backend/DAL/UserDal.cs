using DALContracts;
using Common;
using System;
using Common.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace DAL
{
    public class UserDal : IUserDal
    {
        public Users GetUserByEmail(string email)
        {
            using (var db = new ActiveCitizenContext())
            {
                var user = db.Users.Where(u => u.Email == email).Include("DistrictNavigation").FirstOrDefault();
                return user;
            }
        }

        public void AddUser(Users user)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Add(user);
                db.SaveChanges();
            }
        }

        public Users GetUserById(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Users.Where(u => u.Id == id).Include("DistrictNavigation").FirstOrDefault();
            }
        }

        public bool ConfirmUserEmail(int id)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Find(id).IsConfirmedEmail = true;
                return db.SaveChanges() > 0;
            }
        }

        public bool UpdateUserRole(int userId, int role)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Find(userId).Role = role;
                return db.SaveChanges() > 0;
            }
        }

        public bool ToggleUserBlock(int userId)
        {
            using (var db = new ActiveCitizenContext())
            {
                var user = db.Users.Find(userId);
                user.IsBlocked = !user.IsBlocked;
                return db.SaveChanges() > 0;
            }
        }

        public bool UpdateUserAvatar(int userId, string avatar)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Find(userId).UserAvatar = avatar;
                return db.SaveChanges() > 0;
            }
        }

        public bool DeleteUserAvatar(int userId)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Find(userId).UserAvatar = null;
                return db.SaveChanges() > 0;
            }
        }

        public bool EditUserProfile(Users user)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Entry(db.Users.Find(user.Id)).CurrentValues.SetValues(user);
                return db.SaveChanges() > 0;
            }
        }

        public IEnumerable<Users> SearchByEmail(string fragment)
        {
            using (var db = new ActiveCitizenContext())
            {

                return db.Users.Where(u => u.Email.Contains(fragment)).ToArray();
            }
        }

        public IEnumerable<Users> SearchByFio (string fragment)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Users.Where(u => u.FirstName.Contains(fragment) || u.LastName.Contains(fragment) || u.Patronym.Contains(fragment)).ToArray();
            }
        }

        public bool ChangePassword(string email, string password)
        {
            using (var db = new ActiveCitizenContext())
            {
                db.Users.Where(u => u.Email == email).FirstOrDefault().Password = password;
                return db.SaveChanges() > 0;
            }
        }

        public Users GetUserBySnils(long snils)
        {
            using (var db = new ActiveCitizenContext())
            {
                return db.Users.Where(u => u.Snils == snils).FirstOrDefault();
            }
        }
    }
}
