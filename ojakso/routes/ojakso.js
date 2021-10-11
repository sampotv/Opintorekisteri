var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opintojakso ORDER BY idOpintojakso',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/ojakso/index.ejs
            res.render('ojakso',{data:''});   
        } else {
            // render to views/ojakso/index.ejs
            res.render('ojakso',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('ojakso/add', {
        Koodi: '',
        Laajuus: '',
        Nimi: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.Nimi;
    let errors = false;

    if(Koodi.length === 0 || Laajuus.length === 0 || Nimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Anna kurssin koodi, laajuus ja nimi");
        // render to add.ejs with flash message
        res.render('ojakso/add', {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('ojakso/add', {
                    Koodi: form_data.Koodi,
                    Laajuus: form_data.Laajuus, 
                    Nimi: form_data.Nimi               
                })
            } else {                
                req.flash('success', 'Opintojakso lisätty');
                res.redirect('/ojakso');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
   
    dbConn.query('SELECT * FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'opintojakso ei löydy idOpintojakso = ' + idOpintojakso)
            res.redirect('/ojakso')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('ojakso/edit', {
                title: 'Edit opintojakso', 
                idOpintojakso: rows[0].idOpintojakso,
                Koodi: rows[0].Koodi,
                Laajuus: rows[0].Laajuus,
                Nimi: rows[0].Nimi

            })
        }
    })
})

// update book data
router.post('/update/:idOpintojakso', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
    let Koodi = req.body.Koodi;
    let Laajuus = req.body.Laajuus;
    let Nimi = req.body.Nimi;
    let errors = false;

    if(Koodi.length === 0 || Laajuus.length === 0 || Nimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Ole hyvä ja anna kurssin koodi, laajuus ja nimi");
        // render to add.ejs with flash message
        res.render('ojakso/edit', {
            idOpintojakso: req.params.idOpintojakso,
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Koodi: Koodi,
            Laajuus: Laajuus,
            Nimi: Nimi
        }
        // update query
        dbConn.query('UPDATE opintojakso SET ? WHERE idOpintojakso = ' + idOpintojakso, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('ojakso/edit', {
                    idOpintojakso: req.params.idOpintojakso,
                    Koodi: form_data.Koodi,
                    Laajuus: form_data.Laajuus,
                    Nimi: form_data.Nimi
                })
            } else {
                req.flash('success', 'Opintojakso päivitetty onnistuneesti');
                res.redirect('/ojakso');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:idOpintojakso)', function(req, res, next) {

    let idOpintojakso = req.params.idOpintojakso;
     
    dbConn.query('DELETE FROM opintojakso WHERE idOpintojakso = ' + idOpintojakso, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/ojakso')
        } else {
            // set flash message
            req.flash('success', 'Opintojakso tuhottu! idOpintojakso = ' + idOpintojakso)
            // redirect to books page
            res.redirect('/ojakso')
        }
    })
})

module.exports = router;