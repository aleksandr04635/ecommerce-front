// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  //const pathname = usePathname()
  //var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  //req.nextUrl.searchParams.get('search-key')
  let host = req.headers.host;
  //console.log("host", host);
  res.status(200).json({ name: "John Doe" });
}
