using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class Users
    {
        public Users()
        {
            DirectionIdea = new HashSet<DirectionIdea>();
            IdeaComment = new HashSet<IdeaComment>();
            Participating = new HashSet<Participating>();
            Voting = new HashSet<Voting>();
        }

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
        public string UserAvatar { get; set; }
        public long DateOfBirth { get; set; }

        public virtual Districts DistrictNavigation { get; set; }
        public virtual ICollection<DirectionIdea> DirectionIdea { get; set; }
        public virtual ICollection<IdeaComment> IdeaComment { get; set; }
        public virtual ICollection<Participating> Participating { get; set; }
        public virtual ICollection<Voting> Voting { get; set; }
    }
}
