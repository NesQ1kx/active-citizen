using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Common.Entities
{
    public partial class Districts
    {
        public Districts()
        {
            Users = new HashSet<Users>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Users> Users { get; set; }
    }
}
