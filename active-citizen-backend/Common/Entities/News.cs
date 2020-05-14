using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class News
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string Image { get; set; }
        public long CreateDate { get; set; }
    }
}
