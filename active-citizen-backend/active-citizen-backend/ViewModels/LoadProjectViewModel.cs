using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class LoadProjectViewModel
    {
        public string ProjectTitle { get; set; }
        public string ProjectDescription { get; set; }
        public long ProposeStartDate { get; set; }
        public long ProposeEndDate { get; set; }
        public long VoteStartDate { get; set; }
        public long VoteEndDate { get; set; }
        public bool IsProjectActive { get; set; }
        public string ProjectImage { get; set; }
        public IEnumerable<ProjectDirectionViewModel> ProjectDirection { get; set; }
    }
}
