﻿using DALContracts;
using Common;
using System;
using Common.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

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
    }
}
