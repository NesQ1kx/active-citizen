using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class Participating
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public int ParticipationId { get; set; }

        public virtual Project Project { get; set; }
        public virtual Users User { get; set; }
    }
}
