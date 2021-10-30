export default function security(req, res, next) {

  if (decodeURIComponent(req.url).includes('<script>')) {
    return res.status(406).end('Illegal component in URI');
  }

  next();
}
