const db = new PouchDB("http://admin:admin@couchserver:5984/mydb");

$(  "#add"  ).submit(function(e) {
    e.preventDefault();
    db.post(JSON.parse(e.target.document.value));
});