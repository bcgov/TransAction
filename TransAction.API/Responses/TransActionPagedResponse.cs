using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Responses
{
    public class TransActionPagedResponse : TransActionResponse
    {
        public TransActionPagedResponse(object responseData, int page, int pageSize, int itemCount) : base(responseData)
        {
            Page = page;
            PageSize = pageSize;
            ItemCount = itemCount;
            PageCount = 1;

            if (itemCount > pageSize)
            {
                PageCount = (int)Math.Ceiling((double)itemCount / (double)pageSize);
            }
        }

        public int Page { get; }

        public int PageSize { get; }

        public int PageCount { get; set; }

        public int ItemCount { get; set; }


    }
}



