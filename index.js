//pemanggilan package express
const express = require('express')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

// penggunaan package express
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(flash())

// import db connection
const db = require('./connection/db')

//const isLogin = false


// setup session
app.use(
    session ({
        cookie: {
            maxAge: 1000 * 60 * 60 * 3, 
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: "secret"
    })
)

// membuat endpoint
app.get('/api/', (req, res) => {
    res.send("test")
})

// endpoin create
app.post('/api/create', (req, res) => {
    let {title, story, description, category} = req.body;

    let postArticle = {title, story, description, image: 'image.png', category}

    console.log(postArticle)

    db.connect((err, client, done) => {
        if(err) throw err;

        let query = `INSERT INTO tb_article
                        (title, 
                        story,
                        description, 
                        image, 
                        category)
                    VALUES 
                    ('${title}', 
                    '${story}', 
                    '${description}', 
                    '${image}', 
                    '${category}')`
                    
        client.query(query, (err, result) => {
            done();
            if(err) throw err;
            res.send('article berhasil ditambahkan')
        })
    })
});

// endpoint read
app.get('/api/read', (_req, res) => {
    let query = 'SELECT id, title, story, description, image, category FROM tb_article'
    
    db.connect((err, client, done) => {
        if (err) throw err

        client. query(query, (err, result) => {
            done()
            if (err) throw err
            let data = result.rows
            res.send(data)
            
        })
    })
})

// endpoint detail
app.get('/api/detail-article/:id', (req, res) => {
    let {id} = req.params;

    db.connect((err, client, done) => {
        if (err) throw err;

    let query = `SELECT * FROM tb_article WHERE id = ${id}`
    //console.log(query);
    client.query(query, (err, result) => {
        done();
        if (err) throw err;

        let data = result.rows;
        res.send(data)
        })
    })
})

// endpoint delete
app.get('/api/delete/:id', (req, res) => {
    let {id} = req.params;
    db.connect((err, client, done) => {
        if (err) throw err;

    let query = `DELETE FROM tb_article WHERE id = ${id}`;
    client.query(query, (err, result) => {
        done()
        if (err) throw err

        res.send('data berhasil dihapus')
        })
    })
});

// ========== USER ========== //

// endpoint register
app.post('/api/register', (req, res) => {
    let {fullname, email, password} = req.body
    
    let dataRegister = {
        fullname,
        email,
        password,
        }

        console.log(dataRegister);
    
    db.connect((err, client, done) => {
        if (err) throw err
        let query = `INSERT INTO tb_user(fullname, email, password) VALUES
                        ('${dataRegister.fullname}', '${dataRegister.email}', '${dataRegister.password}')`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            let data = result.rows;
            res.send(data)
        })
    })

})

// endpoint register
app.post('/api/register', (req, res) => {
    let {userName, userEmail, userPassword} = req.body
    
    const hashUserPassword = bcrypt.hashSync(userPassword, 10)

    let dataRegister = {
        userName,
        userEmail,
        userPassword,
        hashUserPassword,
        }
        //console.log(dataRegister);
    
    db.connect((err, client, done) => {
        if (err) throw err
        let query = `INSERT INTO tb_user(fullname, email, password) VALUES
                        ('${dataRegister.userName}', '${dataRegister.userEmail}', '${dataRegister.hashUserPassword}')`
        client.query(query, (err, result) => {
            done()
            if (err) throw err

            req.flash('success', 'registrasi berhasil')
            res.send('berhasil register')
        })
    })

})


//endpoint login
app.post('/login', (req, res) => {
    let {userEmail, userPassword} = req.body
  
    db.connect((err, client, done) => {
        if (err) throw err
        let query = `SELECT * FROM tb_user WHERE email = '${userEmail}'`
        
        client.query(query, (err, result) => {
            done()
            if (err) throw err;

            //console.log(result)

            if (result.rowCount == 0) {
                req.flash('danger', 'email dan/atau password salah')
                return res.send('login gagal')
            }

            let isMatch = bcrypt.compareSync(userPassword, result.rows[0].user_password);

            if(isMatch) {
                req.session.isLogin = true;
                req.session.user = {
                    id: result.rows[0].id_user,
                    email: result.rows[0].user_email,
                    name: result.rows[0].user_name
                }
                //console.log(req.session.user);

                req.flash('success', 'login success')
                res.send('login berhasil');
            } else {
                req.flash('danger', 'email and password doesnt match')
                res.redirect('gagal');
            }
        })
    })
})




app.get('/logout', (req, res) => {
    req.session.destroy()
    res.send('berhasil logout')
})

// konfigurasi port application
const port = 5000

app.listen(port, () => { //  erofunction
    console.log(`server running on PORT ${port}`);
})