using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace active_citizen_backend.ViewModels
{
    public class AddNewsViewModel
    {
        public string Title { get; set; }
        public string Text { get; set; }
        public long CreateDate { get; set; }
        public string Image { get; set; }
    }
}
