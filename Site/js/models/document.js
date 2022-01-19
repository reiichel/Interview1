var Document = function () {
    self = this;
    self.Id = -1;
    self.Name = 'new';
    self.TotalAmount = 0;
}

var getDocuments = function() {
    if (localStorage.getItem("documents") === null) {
        return [];
    }
    let docs = JSON.parse(localStorage.getItem("documents"));
    return docs;
}

var setDocuments = function(docs) {
    localStorage.setItem("documents", ko.toJSON(docs));
}

var deleteDocument = function(id) {
    let docs = getDocuments();
    docs.splice(docs.findIndex(({Id}) => Id === id), 1);
    setDocuments(docs);
}

var addDocument = function(doc) {
    var docs = getDocuments();
    docs.push(doc);
    setDocuments(docs);
}