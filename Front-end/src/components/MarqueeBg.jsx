import '../styles/MarqueeBg.css'

const TOKEN = 'pk_RgZv9IVvRsCQxCCmTGIIUw'

const companies = [
  { name: "L'Oréal", domain: "loreal.com" },
  { name: "LVMH", domain: "lvmh.com" },
  { name: "BNP Paribas", domain: "bnpparibas.com" },
  { name: "Société Générale", domain: "societegenerale.com" },
  { name: "Orange", domain: "orange.com" },
  { name: "Capgemini", domain: "capgemini.com" },
  { name: "Thales", domain: "thalesgroup.com" },
  { name: "Airbus", domain: "airbus.com" },
  { name: "Renault", domain: "renault.com" },
  { name: "Decathlon", domain: "decathlon.com" },
  { name: "Cdiscount", domain: "cdiscount.com" },
  { name: "Leboncoin", domain: "leboncoin.fr" },
  { name: "Deezer", domain: "deezer.com" },
  { name: "Doctolib", domain: "doctolib.fr" },
  { name: "Blablacar", domain: "blablacar.com" },
  { name: "Qonto", domain: "qonto.com" },
  { name: "Swile", domain: "swile.co" },
  { name: "Payfit", domain: "payfit.com" },
]

function MarqueeBg() {
  const triple = [...companies, ...companies, ...companies]

  return (
    <div className="marquee-bg">
      <div className="marquee-bg__track">
        {triple.map((c, i) => (
          <div key={i} className="marquee-bg__item">
            <img
              src={`https://img.logo.dev/${c.domain}?token=${TOKEN}&size=80`}
              alt={c.name}
              className="marquee-bg__logo"
            />
          </div>
        ))}
      </div>
      <div className="marquee-bg__track marquee-bg__track--reverse">
        {triple.map((c, i) => (
          <div key={i} className="marquee-bg__item">
            <img
              src={`https://img.logo.dev/${c.domain}?token=${TOKEN}&size=80`}
              alt={c.name}
              className="marquee-bg__logo"
            />
          </div>
        ))}
      </div>
      <div className="marquee-bg__track">
        {triple.map((c, i) => (
          <div key={i} className="marquee-bg__item">
            <img
              src={`https://img.logo.dev/${c.domain}?token=${TOKEN}&size=80`}
              alt={c.name}
              className="marquee-bg__logo"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarqueeBg