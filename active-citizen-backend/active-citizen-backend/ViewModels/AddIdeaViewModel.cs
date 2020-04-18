using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class AddIdeaViewModel
    {
        public string IdeaTitle{ get; set; }
        public string IdeaDescription { get; set; }
        public int UserId { get; set; }
        public int DirectionId { get; set; }
        public long CreateDate { get; set; }
    }
}
