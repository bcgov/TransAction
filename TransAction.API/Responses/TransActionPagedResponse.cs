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
            this.page = page;
            this.pageSize = pageSize;
            this.itemCount = itemCount;
            if (itemCount < pageSize || pageSize <= 0)
            {
                pageCount = 1;
            }
            else
            {
                pageCount = (int)((itemCount / pageSize) + 1);
            }
        }

        public int page { get; }

        public int pageSize { get; }

        public int pageCount { get; set; }

        public int itemCount { get; set; }


    }
}



