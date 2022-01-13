using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace DocumentsAPI
{
    public class DocumentsDiscountService
    {
        public DocumentsDiscountService()
        {
            //Thread makingDiscountsThread = new Thread(new ThreadStart(StartMakingDiscounts));
            //makingDiscountsThread.IsBackground = true;
            //makingDiscountsThread.Start();

            Thread makingOneDiscountsThread = new Thread(new ThreadStart(StartMakingOneDiscount));
            makingOneDiscountsThread.IsBackground = true;
            makingOneDiscountsThread.Start();
        }

        public void StartMakingDiscounts()
        {
            var storage = MemoryStorage.GetInstance();

            while (true)
            {
                var docIds = storage.GetAllDocumentsIds();
                foreach (var id in docIds)
                {
                    storage.DocumentAmountDiscount(id, 11);

                }
                Thread.Sleep(3000);
            }
        }

        public void StartMakingOneDiscount()
        {
            var storage = MemoryStorage.GetInstance();

            while (true)
            {
                var docIds = storage.GetAllDocumentsIds();
                foreach (var id in docIds)
                {
                    Document d = storage.GetDocument(id);
                    if (d.TotalUpdates == 2)
                    {
                        storage.DocumentAmountDiscount(id, 11);
                    }
                }
                Thread.Sleep(3000);
            }
        }
    }
}
