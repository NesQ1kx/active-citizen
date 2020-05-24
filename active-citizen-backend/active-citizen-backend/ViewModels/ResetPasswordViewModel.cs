using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class ResetPasswordViewModel
    {
        public string Token { get; set; }
        public string Password { get; set; }
    }
}
