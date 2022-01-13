using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DocumentsAPI.Interfaces;
using Newtonsoft.Json;
using Swashbuckle.Swagger.Annotations;

namespace DocumentsAPI.Controllers
{
    public class DocumentsController : ApiController
    {
        // GET api/Documents/GetAll
        [HttpGet]
        [ActionName("GetAll")]
        public HttpResponseMessage GetAll()
        {
            HttpStatusCode sCode = HttpStatusCode.OK;            
            Dictionary<string, object> retData = new Dictionary<string, object>();

            IStorage storage = MemoryStorage.GetInstance();
            try
            {
                retData.Add("status", "ok");
                retData.Add("data", storage.GetAllDocuments());
            }
            catch (Exception ex)
            {
                sCode = HttpStatusCode.InternalServerError;
                retData.Add("status", "error");
                retData.Add("err", "Failed");
            }
            HttpResponseMessage response = new HttpResponseMessage(sCode);
            response.Content = new StringContent(JsonConvert.SerializeObject(retData));
            return response;
        }

        // GET api/Documents/Get
        [HttpGet]
        [ActionName("Get")]
        public HttpResponseMessage Get(int id)
        {
            HttpStatusCode sCode = HttpStatusCode.OK;
            Dictionary<string, object> retData = new Dictionary<string, object>();

            var storage = MemoryStorage.GetInstance();
            try
            {                
                Document document = storage.GetDocument(id);
                if (document == null)
                {
                    sCode = HttpStatusCode.NotFound;
                    retData.Add("status", "error");
                    retData.Add("err", "Failed");
                }
                else
                {
                    retData.Add("status", "ok");
                    retData.Add("data", document);
                }                
            }
            catch (Exception ex)
            {
                sCode = HttpStatusCode.NotFound;
                retData.Add("status", "error");
                retData.Add("err", "Failed");
            }
            HttpResponseMessage response = new HttpResponseMessage(sCode);
            response.Content = new StringContent(JsonConvert.SerializeObject(retData));
            return response;
        }

        // POST api/Documents/Post
        [HttpPost]
        [ActionName("Post")]
        public HttpResponseMessage Post(Document doc)
        {
            HttpStatusCode sCode = HttpStatusCode.OK;            
            Dictionary<string, object> retData = new Dictionary<string, object>();
            var storage = MemoryStorage.GetInstance();            
            try
            {                
                storage.SaveDocument(doc);
                retData.Add("status", "ok");
                retData.Add("data", "");
            }            
            catch (Exception ex)
            {
                sCode = HttpStatusCode.InternalServerError;
                retData.Add("status", "error");
                retData.Add("err", "Failed");
            }
            HttpResponseMessage response = new HttpResponseMessage(sCode);
            response.Content = new StringContent(JsonConvert.SerializeObject(retData));
            return response;
        }

        // PUT api/Documents/Update/5
        [HttpPut]
        [ActionName("Update")]
        public HttpResponseMessage Update(int id, [FromBody]decimal NewAmount)
        {
            HttpStatusCode sCode = HttpStatusCode.OK;
            Dictionary<string, object> retData = new Dictionary<string, object>();

            var storage = MemoryStorage.GetInstance();
            try
            {                
                storage.UpdateDocumentAmount(id, NewAmount);
                retData.Add("status", "ok");
                retData.Add("data", "");
            }
            catch (Exception ex)
            {
                sCode = HttpStatusCode.InternalServerError;
                retData.Add("status", "error");
                retData.Add("err", "Failed");
            }
            HttpResponseMessage response = new HttpResponseMessage(sCode);
            response.Content = new StringContent(JsonConvert.SerializeObject(retData));
            return response;
        }

        // DELETE api/Documents/Delete/5
        [HttpDelete]
        [ActionName("Delete")]
        public HttpResponseMessage Delete(int id)
        {
            HttpStatusCode sCode = HttpStatusCode.OK;
            Dictionary<string, object> retData = new Dictionary<string, object>();

            var storage = MemoryStorage.GetInstance();
            try
            {
                retData.Add("status", "ok");
                storage.DeleteDocument(id);
                retData.Add("data", "");
            }
            catch (Exception ex)
            {
                sCode = HttpStatusCode.InternalServerError;
                retData.Add("status", "error");
                retData.Add("err", "Failed");
            }
            HttpResponseMessage response = new HttpResponseMessage(sCode);
            response.Content = new StringContent(JsonConvert.SerializeObject(retData));
            return response;
        }
    }
}
