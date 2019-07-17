using AutoMapper.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Responses
{
    public class TransActionResponse
    {
        public TransActionResponse(object ResponseData)
        {
            Data = ResponseData;
            ResponseStatus = "OK";
        }
        public TransActionResponse(string error)
        {
            Message = error;
            ResponseStatus = "ERROR";
        }

        public string ResponseStatus { get; }

        public object Data { get; }

        public string Message { get; }

    }


}
