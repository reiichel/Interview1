using DocumentsAPI.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DocumentsAPI
{
    public class MemoryStorage : IStorage
    {
        private static MemoryStorage _instance;
        private static object syncObj = new object();
        private Dictionary<int, Document> Documents;

        public static MemoryStorage GetInstance()
        {
            if (_instance == null)
            {
                lock (syncObj)
                {
                    if (_instance == null)
                        _instance = new MemoryStorage();
                }
            }
            return _instance;
        }

        private MemoryStorage()
        {
            Documents = new Dictionary<int, Document>();
        }

        public void SaveDocument(Document document)
        {
            Random rnd = new Random();
            bool saved = false;
            if (rnd.Next(1, 11) > 5)
            {
                Task.Delay(1000);
                // ToDo: Store in memory here - done                
                try
                {
                    lock (syncObj)
                    {
                        saved = _saveDocument(document);
                    }
                    if (!saved)
                    {
                        //logging error
                        throw new Exception("Failed to generate document");
                    }
                    return;
                }
                catch
                {
                    //logging error
                    throw new Exception("Failed to generate document");
                }
            }
            saved = _saveDocument(document);
            if (!saved)
            {
                //logging error
                throw new Exception("Failed to generate document");
            }
        }

        private bool _saveDocument(Document document)
        {
            int i = 0;
            bool existId = false;
            do
            {
                int id = generateDocId();
                existId = Documents.ContainsKey(id);
                //if (!existId)
                //{
                //    lock (syncObj)
                //    {
                //        existId = Documents.ContainsKey(id);
                if (!existId)
                {
                    document.Id = id;
                    Documents.Add(id, document);
                    return !existId;
                }
                //    }
                //}

                ++i;
            }
            while (i < 3 && existId);
            return !existId;
        }

        public Document GetDocument(int id)
        {
            // ToDo: Fetch from memory here - done
            Document document = null;
            try
            {
                lock (syncObj)
                {
                    Documents.TryGetValue(id, out document);
                }
            }
            catch
            {
                //logging error
            }
            return document;
        }

        public List<Document> GetAllDocuments()
        {
            // ToDo: Implement - done
            return Documents.Values.ToList();
        }

        public List<int> GetAllDocumentsIds()
        {
            // ToDo: Implement - done
            return new List<int>(Documents.Keys);
        }

        public void UpdateDocumentAmount(int docId, decimal newAmount)
        {
            // ToDo: Implement - done
            Document document = null;
            try
            {
                lock (syncObj)
                {
                    Documents.TryGetValue(docId, out document);
                    if (document != null)
                    {
                        document.TotalAmount = newAmount;
                        document.TotalUpdates++;
                        Documents[docId] = document;
                    }
                }
            }
            catch
            {
                //logging error
            }
        }

        public void DeleteDocument(int docId)
        {
            // ToDo: Implement - done           
            try
            {
                lock (syncObj)
                {
                    Documents.Remove(docId);
                }
            }
            catch
            {
                //logging error
            }
        }

        /// <summary>
        /// Reduce the discountAmount from the current amount
        /// </summary>
        /// <param name="docId"></param>
        /// <param name="discountAmount"></param>
        public void DocumentAmountDiscount(int docId, decimal discountAmount)
        {
            Document document = null;
            try
            {
                lock (syncObj)
                {
                    Documents.TryGetValue(docId, out document);
                    if (document != null && document.TotalAmount >= discountAmount)
                    {
                        document.TotalAmount -= discountAmount;
                        Documents[docId] = document;
                    }
                }
            }
            catch
            {
                //logging error
            }
        }

        private static int generateDocId()
        {
            var random = new Random();
            return random.Next(1, 11);
        }
    }
}
