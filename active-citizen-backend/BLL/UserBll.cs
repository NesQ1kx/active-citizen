using BLLContracts;
using Common;
using Common.Entities;
using DALContracts;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace BLL
{
    public class UserBll : IUserBll
    {
        private IUserDal _userDal;
        private EmailSender _emailSender;
        private IProjectDal _projectDal;
        RSACryptoServiceProvider RSA;
        string privateKey;
        string publicKey;

        public UserBll(IUserDal userDal, EmailSender sender, IProjectDal projectDal)
        {
            _userDal = userDal;
            _emailSender = sender;
            _projectDal = projectDal;
            RSA = new RSACryptoServiceProvider();
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

        public Users GetUserById(int id)
        {
            return _userDal.GetUserById(id);
        }

        public void SendConfirmationEmail(string email)
        {
            string s = GenerateToken(email);
            string token = HttpUtility.UrlEncode(s);
            string confirmationLink = $"http://localhost:3000/confirmed/{token}";
            string message = $"Для завершения регистрации перейдите по ссылке: <a href={confirmationLink}>{confirmationLink}</a>";
            _emailSender.SendEmail(email, "Подтверждение регистрации", message);
        }

        public string GenerateToken(string email)
        {
            StreamWriter writer = new StreamWriter("PrivateKey.xml");
            privateKey = RSA.ToXmlString(true);
            writer.Write(privateKey);
            writer.Close();
            writer = new StreamWriter("PublicKey.xml");
            publicKey = RSA.ToXmlString(false);
            writer.Write(publicKey);
            writer.Close();
            byte[] encBytes = RSA.Encrypt(Encoding.Unicode.GetBytes(email), false);
            return Convert.ToBase64String(encBytes);
        }

        public string GetEmailFromToken(string token)
        {
            string s = Uri.UnescapeDataString(token);
            byte[] encBytes = Convert.FromBase64String(s);
            StreamReader reader = new StreamReader("PrivateKey.xml");
            privateKey = reader.ReadToEnd();
            RSA.FromXmlString(privateKey);
            reader.Close();
            byte[] decBytes = RSA.Decrypt(encBytes, false);
            return Encoding.Unicode.GetString(decBytes);
        }

        public bool ConfirmUserEmail(int id)
        {
            return _userDal.ConfirmUserEmail(id);
        }

        public void NotifyAboutProjectStart(int projectId)
        {
            var participants = new List<Users>();
            foreach(var p in _projectDal.GetParticipants(projectId))
            {
                participants.Add(_userDal.GetUserById(p.UserId));
            }

            foreach(var u in participants)
            {
                string link = $"http://localhost:3000/current-projects/{projectId}";
                string message = $"Уважаемый(ая) {u.FirstName} {u.Patronym}, совсем скоро стартует проект, на который Вы регистрировались. \n " +
                    $"Вы можете найти его здесь: <a href={link}>{link}</a>";
                _emailSender.SendEmail(u.Email, "Оповещение о начале проекта", message);
            }
        }
    }
}   
