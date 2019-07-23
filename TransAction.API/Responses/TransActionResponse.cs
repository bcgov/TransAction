using AutoMapper.Configuration;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransAction.API.Responses
{
    public class TransActionResponse
    {
        public TransActionResponse()
        {
            ResponseStatus = "OK";
        }
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

        public TransActionResponse(string ResponseData, string message)
        {
            Data = ResponseData != string.Empty ? ResponseData : null;
            Message = message;
        }

        public TransActionResponse(ModelStateDictionary modelState)
        {
            Message = "Validation Failed";
            Errors = modelState.Keys
                    .SelectMany(key => modelState[key].Errors.Select(x => new ValidationError(key, x.ErrorMessage)))
                    .ToList();
        }
        public string ResponseStatus { get; }

        public object Data { get; }

        public string Message { get; }

        public List<ValidationError> Errors { get; }
    }

    public class ValidationError
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Field { get; }

        public string Message { get; }

        public ValidationError(string field, string message)
        {
            Field = field != string.Empty ? field : null;
            Message = message;
        }
    }


}
