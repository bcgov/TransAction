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
            this.Page = page;
            this.PageSize = pageSize;
            this.ItemCount = itemCount;
            if (itemCount < pageSize || pageSize <= 0)
            {
                PageCount = 1;
            }
            else
            {

                PageCount = (int)Math.Ceiling((decimal)itemCount / (decimal)pageSize);
            }
        }

        public int Page { get; }

        public int PageSize { get; }

        public int PageCount { get; set; }

        public int ItemCount { get; set; }


    }
}



