using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class DirectionIdea
    {
        public int Id { get; set; }
        public string IdeaTitle { get; set; }
        public string IdeaDescription { get; set; }
        public int? DirectionId { get; set; }
        public int VotesCount { get; set; }
        public int? UserId { get; set; }
        public int Status { get; set; }
        public int RejectReason { get; set; }
        public long CreateDate { get; set; }

        public virtual ProjectDirection Direction { get; set; }
        public virtual Users User { get; set; }
    }
}
