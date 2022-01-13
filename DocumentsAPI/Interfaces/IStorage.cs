using DocumentsEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DocumentsAPI.Interfaces
{
    interface IStorage
    {
        void SaveDocument(Document document);

        Document GetDocument(int id);

        List<Document> GetAllDocuments();

        List<int> GetAllDocumentsIds();

        void UpdateDocumentAmount(int docId, decimal newAmount);

        void DeleteDocument(int docId);
    }
}
