using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class EditUserProfileViewModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Patronym { get; set; }
        public int District { get; set; }
        public long Snils { get; set; }
        public long DateOfBirth { get; set; }
    }
}
