using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class ProjectDirection
    {
        public ProjectDirection()
        {
            DirectionIdea = new HashSet<DirectionIdea>();
        }

        public int Id { get; set; }
        public string DirectionTitle { get; set; }
        public string DirectionDescription { get; set; }
        public int CountOfIdeas { get; set; }
        public int CountOfComments { get; set; }
        public int? ProjectId { get; set; }

        public virtual Project Project { get; set; }
        public virtual ICollection<DirectionIdea> DirectionIdea { get; set; }
    }
}
