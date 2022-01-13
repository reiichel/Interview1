using System;
using System.Collections.Generic;
using System.Text;

namespace DocumentsAPI
{
    public class Document
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public decimal TotalAmount { get; set; }

        public int TotalUpdates { get; set; }
    }
}
