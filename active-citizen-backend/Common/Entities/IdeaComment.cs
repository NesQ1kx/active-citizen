using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class IdeaComment
    {
        public IdeaComment()
        {
            InverseParrentCommentNavigation = new HashSet<IdeaComment>();
        }

        public int Id { get; set; }
        public string CommentText { get; set; }
        public int UserId { get; set; }
        public int IdeaId { get; set; }
        public long CreateDate { get; set; }
        public int? ParrentComment { get; set; }

        public virtual DirectionIdea Idea { get; set; }
        public virtual IdeaComment ParrentCommentNavigation { get; set; }
        public virtual Users User { get; set; }
        public virtual ICollection<IdeaComment> InverseParrentCommentNavigation { get; set; }
    }
}
