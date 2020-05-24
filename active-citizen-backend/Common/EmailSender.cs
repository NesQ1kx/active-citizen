using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Common
{
    public class EmailSender
    {
        private SmtpClient _smtp;

        public EmailSender()
        {
            _smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("active.citizen.tech@gmail.com", "activecitizen1234"),
                Timeout = 20000,
            };
        }

        public void SendEmail(string userEmail, string messageSubject, string emailText)
        {
            MailAddress from = new MailAddress("active.citizen.tech@gmail.com");
            MailAddress to = new MailAddress(userEmail);
            MailMessage message = new MailMessage(from, to);
            message.Body = emailText;
            message.Subject = messageSubject;
            message.IsBodyHtml = true;
            _smtp.Send(message);
        }
    }
}
