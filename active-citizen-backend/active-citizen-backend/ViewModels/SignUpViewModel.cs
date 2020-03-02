using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class SignUpViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Patronym { get; set; }
        public string Email { get; set; }
        public long Snils { get; set; }
        public int District { get; set; }
        public int Sex { get; set; }
        public string Password { get; set; }
        public string PasswordRepeat { get; set; }
    }
}
