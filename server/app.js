import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import dotenv from 'dotenv'
import methodOverride from 'method-override'
import session from 'express-session'


import connectMongo from './config/mongoose.js'
import indexRouter from './routes/contactos.js'
import filmRouter from './routes/films.js'
import detailsRouter from './routes/details.js'
import cartRouter from './routes/cart.js'
import { viteAsset, viteCssFiles, isDev } from './utils/vite-assets.js'

dotenv.config()

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectMongo()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(session({
    secret: process.env.SECRETO || 'clave_secreta_carrito',
    resave: false,
    saveUninitialized: false
}));


app.use('/build', express.static(path.resolve(process.cwd(), 'public/build')))
app.use(express.static(path.resolve(process.cwd(), 'public')))

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production'
})

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));

app.set('view engine', 'njk')
app.set('views', path.join(__dirname, 'views'))

app.locals.isDev = isDev
app.locals.viteAsset = viteAsset
app.locals.viteCssFiles = viteCssFiles

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use('/contactos', indexRouter)
app.use('/films', filmRouter)
//app.use('/details', detailsRouter)
//app.use('/cart', cartRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Servidor: http://localhost:${port}`)
})