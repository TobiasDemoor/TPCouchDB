const db = new PouchDB("couchdb");
const remote = new PouchDB("http://admin:admin@localhost:5984/couchdb");
db.sync(remote, {
    live: true, // mantiene conexión abierta
    retry: true // si se cae la conexión vuelve a intentar conectarse
}).on('change', function (change) {
    console.log('data change', change)
}).on('error', function (err) {
    console.log('sync error', err)
})

$("#add").submit(function (e) {
    e.preventDefault();
    db.post(JSON.parse(e.target.document.value));
    refreshDocuments();
});

function refreshDocuments() {
    $("#documents").html("");
    db.allDocs({ include_docs: true })
        .then((docs) => {
            console.log(docs)
            for (row of docs.rows) {
                $("#documents").append(`<p style="white-space: pre-wrap;">${JSON.stringify(row.doc, null, 2)}</p>`)
            }
        });
}

refreshDocuments();

let controlAutomatic = false;

function automatic() {
    let person = {
        fullname: chance.name(),
        age: chance.age(),
        phone: chance.phone(),
        address: chance.address()
    };
    console.log(`New person added to database: ${person.fullname}`);
    db.post(person);
    if (controlAutomatic) {
        setTimeout(automatic, 3000);
    }
}

$("#automatic").change(function () {
    if ($("#automatic").is(":checked")) {
        controlAutomatic = true;
        automatic();
    } else {
        controlAutomatic = false;
    }
})