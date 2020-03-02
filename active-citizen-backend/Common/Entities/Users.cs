using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Common.Entities
{
    public partial class Users
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Patronym { get; set; }
        public string Email { get; set; }
        public long Snils { get; set; }
        public int? District { get; set; }
        public int Sex { get; set; }
        public bool IsBlocked { get; set; }
        public string Password { get; set; }
        public bool IsConfirmedEmail { get; set; }
        public int Role { get; set; }

        public virtual Districts DistrictNavigation { get; set; }
    }
}
