using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class Project
    {
        public Project()
        {
            Participating = new HashSet<Participating>();
            ProjectDirection = new HashSet<ProjectDirection>();
        }

        public int Id { get; set; }
        public string ProjectTitle { get; set; }
        public string ProjectDescription { get; set; }
        public long ProposeStartDate { get; set; }
        public long ProposeEndDate { get; set; }
        public long VoteStartDate { get; set; }
        public long VoteEndDate { get; set; }
        public bool IsProjectActive { get; set; }
        public string ProjectImage { get; set; }
        public int? ParticipantsCount { get; set; }

        public virtual ICollection<Participating> Participating { get; set; }
        public virtual ICollection<ProjectDirection> ProjectDirection { get; set; }
    }
}
