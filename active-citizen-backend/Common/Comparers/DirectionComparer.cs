using Common.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Common.Comparers
{
    public class DirectionComparer : IEqualityComparer<ProjectDirection>
    {
        public bool Equals(ProjectDirection x, ProjectDirection y)
        {
            if (ReferenceEquals(x, y)) return true;
            
            if (ReferenceEquals(x, null) || ReferenceEquals(y, null))
                return false;

         
            return x.Id == y.Id;
        }

        public int GetHashCode(ProjectDirection p)
        {
            if (ReferenceEquals(p, null)) return 0;
            return p.Id.GetHashCode();
        }
    }
}
