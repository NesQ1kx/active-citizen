using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class Voting
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int IdeaId { get; set; }

        public virtual DirectionIdea Idea { get; set; }
        public virtual Users User { get; set; }
    }
}
