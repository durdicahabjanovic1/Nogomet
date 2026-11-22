

export const IME_APLIKACIJE = 'Nogomet'


export const RouteNames = { 
    HOME: '/',
    
    OAPLIKACIJI: '/oaplikaciji',
    
    IGRACI: '/igraci',
    IGRACI_DODAJ: '/igraci/novi',
    IGRACI_PROMJENA: '/igraci/:sifra',

    KLUBOVI: '/klubovi',
    KLUBOVI_DODAJ: '/klubovi/novi',
    KLUBOVI_PROMJENA: '/klubovi/:sifra',

    OPERATERI: '/operateri',
    OPERATERI_NOVI: '/operateri/novi',
    OPERATERI_PROMJENA: '/operateri/:sifra',
    OPERATERI_PROMJENA_LOZINKE: '/operateri/:sifra/lozinka',


    GENERIRANJE_PODATAKA: '/generiraj-podatke',

    LOGIN: '/login',
    REGISTRACIJA: '/registracija',

    NADZORNA_PLOCA: '/nadzorna-ploca',

}
// memorija   localStorage, firebase

export const DATA_SOURCE = 'memorija';

// Predavač je e.
// Igrači su eN. gdje je N broj s origo servera (npr e1.)
export const PrefixStorage = {
    KLUBOVI: 'e39.klubovi',
    IGRACI: 'e39.igraci',
    OPERATERI: 'e39.operateri'
}



