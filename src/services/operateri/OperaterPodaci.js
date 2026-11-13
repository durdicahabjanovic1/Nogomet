import bcrypt from 'bcryptjs'

// Inicijalni operateri s hashiranim lozinkama
// Lozinka za sve: "Nogeomet123!"
const hashiranaLozinka = bcrypt.hashSync('Nogomet123!', 10)

export const operateri = [
    {
        sifra: '1',
        email: 'admin@edunova.hr',
        lozinka: hashiranaLozinka,
        uloga: 'admin'
    },
    {
        sifra: '2',
        email: 'operater@edunova.hr',
        lozinka: hashiranaLozinka,
        uloga: 'korisnik'
    }
]

export default{
    operateri
}