export interface Option {
  key: 'A' | 'B' | 'C' | 'D';
  spanish: string;
  armenian: string;
}

export interface Question {
  id: number;
  spanishQuestion: string;
  armenianQuestion: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  category: 'airport' | 'beach' | 'hotel' | 'restaurant' | 'transport' | 'shopping';
  explanation: string;
}

export const questions: Question[] = [
  {
    id: 1,
    spanishQuestion: "Estás en el aeropuerto. ¿Qué necesitas para viajar a otro país?",
    armenianQuestion: "Դու օդանավակայանում ես։ Ի՞նչ է քեզ պետք ուրիշ երկիր ճանապարհորդելու համար։",
    options: [
      { key: 'A', spanish: "un pasaporte", armenian: "անձնագիր" },
      { key: 'B', spanish: "una cuchara", armenian: "գդալ" },
      { key: 'C', spanish: "una silla", armenian: "աթոռ" },
      { key: 'D', spanish: "una lámpara", armenian: "լամպ" }
    ],
    correctAnswer: 'A',
    category: 'airport',
    explanation: "Para viajar a otro país necesitas un pasaporte (անձնագիր). Las otras opciones son una cuchara (գդալ), una silla (աթոռ) y una lámpara (լամպ)."
  },
  {
    id: 2,
    spanishQuestion: "Quieres entregar tu maleta en el aeropuerto. ¿Qué dices?",
    armenianQuestion: "Դու ուզում ես օդանավակայանում հանձնել ճամպրուկդ / ուղեբեռդ։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "Quiero facturar mi equipaje.", armenian: "Ուզում եմ հանձնել իմ ուղեբեռը։" },
      { key: 'B', spanish: "Quiero comer una sopa.", armenian: "Ուզում եմ ապուր ուտել։" },
      { key: 'C', spanish: "Quiero comprar una camiseta.", armenian: "Ուզում եմ շապիկ գնել։" },
      { key: 'D', spanish: "Quiero dormir aquí.", armenian: "Ուզում եմ այստեղ քնել։" }
    ],
    correctAnswer: 'A',
    category: 'airport',
    explanation: "'Facturar el equipaje' significa entregar la maleta para el vuelo (հանձնել ուղեբեռը). Comer sopa (ապուր ուտել), comprar una camiseta (շապիկ գնել) o dormir (քնել) no corresponden al proceso."
  },
  {
    id: 3,
    spanishQuestion: "Estás en la playa y ves una bandera roja. ¿Qué significa?",
    armenianQuestion: "Դու լողափում ես և տեսնում ես կարմիր դրոշ։ Ի՞նչ է դա նշանակում։",
    options: [
      { key: 'A', spanish: "Se puede nadar mucho.", armenian: "Կարելի է շատ լողալ։" },
      { key: 'B', spanish: "No se puede nadar.", armenian: "Չի կարելի լողալ։" },
      { key: 'C', spanish: "Hay una fiesta.", armenian: "Տոն / երեկույթ կա։" },
      { key: 'D', spanish: "Hay comida gratis.", armenian: "Անվճար ուտելիք կա։" }
    ],
    correctAnswer: 'B',
    category: 'beach',
    explanation: "La bandera roja en la playa indica peligro y significa que está prohibido nadar (Չի կարելի լողալ)."
  },
  {
    id: 4,
    spanishQuestion: "En el aeropuerto, tu vuelo está retrasado. ¿Qué pregunta es más útil?",
    armenianQuestion: "Օդանավակայանում քո չվերթը ուշանում է։ Ո՞ր հարցն է ամենաօգտակարը։",
    options: [
      { key: 'A', spanish: "¿Dónde puedo comprar una camiseta?", armenian: "Որտե՞ղ կարող եմ շապիկ գնել։" },
      { key: 'B', spanish: "¿Cuánto tiempo de retraso tiene el vuelo?", armenian: "Չվերթը որքան ժամանակո՞վ է ուշանում։" },
      { key: 'C', spanish: "¿Tiene comida vegetariana?", armenian: "Բուսակերական ուտելիք ունե՞ք։" },
      { key: 'D', spanish: "¿Dónde está la playa?", armenian: "Որտե՞ղ է լողափը։" }
    ],
    correctAnswer: 'B',
    category: 'airport',
    explanation: "Si el vuelo está retrasado (ուշանում է), es útil preguntar por el tiempo de retraso (չվերթի ուշացման տևողությունը)."
  },
  {
    id: 5,
    spanishQuestion: "Llegas al hotel, pero no encuentran tu reserva. ¿Qué dices?",
    armenianQuestion: "Դու հասնում ես հյուրանոց, բայց նրանք չեն գտնում քո ամրագրումը։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "Tengo una reserva a mi nombre. ¿Puede comprobarlo otra vez?", armenian: "Ես իմ անունով ամրագրում ունեմ։ Կարո՞ղ եք ևս մեկ անգամ ստուգել։" },
      { key: 'B', spanish: "Quiero una sopa, por favor.", armenian: "Ապուր եմ ուզում, խնդրում եմ։" },
      { key: 'C', spanish: "Me gusta mucho este hotel.", armenian: "Ինձ շատ է դուր գալիս այս հյուրանոցը։" },
      { key: 'D', spanish: "Voy a la playa ahora.", armenian: "Հիմա գնում եմ լողափ։" }
    ],
    correctAnswer: 'A',
    category: 'hotel',
    explanation: "Ante un problema con la reserva (ամրագրում), pides que lo comprueben otra vez (ստուգել ևս մեկ անգամ)."
  },
  {
    id: 6,
    spanishQuestion: "En un restaurante te traen un plato con carne, pero tú has pedido sin carne. ¿Qué dices?",
    armenianQuestion: "Ռեստորանում քեզ բերում են մսով ուտեստ, բայց դու խնդրել էիր առանց մսի։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "Está muy lejos.", armenian: "Շատ հեռու է։" },
      { key: 'B', spanish: "Perdón, he pedido este plato sin carne.", armenian: "Կներեք, ես այս ուտեստը խնդրել էի առանց մսի։" },
      { key: 'C', spanish: "Quiero facturar mi equipaje.", armenian: "Ուզում եմ հանձնել իմ ուղեբեռը։" },
      { key: 'D', spanish: "No sé nadar.", armenian: "Ես լողալ չգիտեմ։" }
    ],
    correctAnswer: 'B',
    category: 'restaurant',
    explanation: "Para reclamar educadamente, dices: 'Perdón, he pedido este plato sin carne' (Կներեք, ես այս ուտեստը խնդրել էի առանց մսի)."
  },
  {
    id: 7,
    spanishQuestion: "Estás en una tienda y la camiseta te gusta, pero es muy cara. ¿Qué frase es mejor?",
    armenianQuestion: "Դու խանութում ես, շապիկը քեզ դուր է գալիս, բայց շատ թանկ է։ Ո՞ր արտահայտությունն է ավելի լավ։",
    options: [
      { key: 'A', spanish: "Es demasiado caro. ¿Tiene algo más barato?", armenian: "Սա չափազանց թանկ է։ Ավելի էժան բան ունե՞ք։" },
      { key: 'B', spanish: "Quiero una habitación.", armenian: "Սենյակ եմ ուզում։" },
      { key: 'C', spanish: "No puedo nadar aquí.", armenian: "Ես այստեղ չեմ կարող լողալ։" },
      { key: 'D', spanish: "La cuenta, por favor.", armenian: "Հաշիվը, խնդրում եմ։" }
    ],
    correctAnswer: 'A',
    category: 'shopping',
    explanation: "Si algo es muy caro, puedes preguntar por opciones más baratas (ավելի էժան բան)."
  },
  {
    id: 8,
    spanishQuestion: "En el metro, no sabes si vas en la dirección correcta. ¿Qué preguntas?",
    armenianQuestion: "Մետրոյում դու չգիտես՝ ճիշտ ուղղությամբ ես գնում, թե ոչ։ Ի՞նչ ես հարցնում։",
    options: [
      { key: 'A', spanish: "¿Este metro va al centro?", armenian: "Այս մետրոն գնում է դեպի կենտրոն՞։" },
      { key: 'B', spanish: "¿Tiene otra talla?", armenian: "Ուրիշ չափս ունե՞ք։" },
      { key: 'C', spanish: "¿Dónde está la carta?", armenian: "Որտե՞ղ է ճաշացանկը։" },
      { key: 'D', spanish: "¿Puedo pagar con sopa?", armenian: "Կարո՞ղ եմ ապուրով վճարել։" }
    ],
    correctAnswer: 'A',
    category: 'transport',
    explanation: "Para confirmar el destino del transporte, puedes preguntar: '¿Este metro va al centro?' (Այս մետրոն գնում է դեպի կենտրոն՞):"
  },
  {
    id: 9,
    spanishQuestion: "En la playa hay bandera amarilla. ¿Qué haces?",
    armenianQuestion: "Լողափում դեղին դրոշ կա։ Ի՞նչ ես անում։",
    options: [
      { key: 'A', spanish: "Nado muy lejos.", armenian: "Շատ հեռու եմ լողում։" },
      { key: 'B', spanish: "Nado con cuidado y cerca de la orilla.", armenian: "Լողում եմ զգույշ և ափին մոտ։" },
      { key: 'C', spanish: "Entro al mar aunque haya peligro.", armenian: "Մտնում եմ ծով, նույնիսկ եթե վտանգ կա։" },
      { key: 'D', spanish: "No miro la bandera.", armenian: "Չեմ նայում դրոշին։" }
    ],
    correctAnswer: 'B',
    category: 'beach',
    explanation: "La bandera amarilla en la playa significa precaución: se permite nadar pero con cuidado y cerca de la orilla (Լողում եմ զգույշ և ափին մոտ)."
  },
  {
    id: 10,
    spanishQuestion: "El camarero habla muy rápido y no entiendes. ¿Qué dices?",
    armenianQuestion: "Մատուցողը շատ արագ է խոսում, և դու չես հասկանում։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "¿Puede hablar más despacio, por favor?", armenian: "Կարո՞ղ եք ավելի դանդաղ խոսել, խնդրում եմ։" },
      { key: 'B', spanish: "¿Puede dormir más despacio?", armenian: "Կարո՞ղ եք ավելի դանդաղ քնել։" },
      { key: 'C', spanish: "¿Puede comer más despacio?", armenian: "Կարո՞ղ եք ավելի դանդաղ ուտել։" },
      { key: 'D', spanish: "¿Puede comprar más despacio?", armenian: "Կարո՞ղ եք ավելի դանդաղ գնել։" }
    ],
    correctAnswer: 'A',
    category: 'restaurant',
    explanation: "Para pedir que repitan despacio se dice: '¿Puede hablar más despacio, por favor?' (Կարո՞ղ եք ավելի դանդաղ խոսել, խնդրում եմ):"
  },
  {
    id: 11,
    spanishQuestion: "Quieres comprar un billete, pero no sabes si necesitas ida o ida y vuelta. ¿Qué pregunta ayuda más?",
    armenianQuestion: "Դու ուզում ես տոմս գնել, բայց չգիտես՝ մեկ ուղղությա՞ն, թե՞ գնալ-վերադառնալու տոմս է պետք։ Ո՞ր հարցն է ավելի օգտակար։",
    options: [
      { key: 'A', spanish: "¿Qué me recomienda: ida o ida y vuelta?", armenian: "Ի՞նչ եք խորհուրդ տալիս՝ մեկ ուղղությա՞ն, թե՞ գնալ-վերադառնալու։" },
      { key: 'B', spanish: "¿Dónde está mi cama?", armenian: "Որտե՞ղ է իմ մահճակալը։" },
      { key: 'C', spanish: "¿Tiene comida sin carne?", armenian: "Առանց մսի ուտելիք ունե՞ք։" },
      { key: 'D', spanish: "¿Puedo probarme esto?", armenian: "Կարո՞ղ եմ սա փորձել։" }
    ],
    correctAnswer: 'A',
    category: 'transport',
    explanation: "La pregunta recomendada es pedir consejo entre un billete de solo 'ida' (մեկ ուղղությամբ) o 'ida y vuelta' (գնալ-վերադառնալ)."
  },
  {
    id: 12,
    spanishQuestion: "En el hotel, el aire acondicionado no funciona y hace mucho calor. ¿Qué dices?",
    armenianQuestion: "Հյուրանոցում օդորակիչը չի աշխատում, և շատ շոգ է։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "El aire acondicionado no funciona. ¿Puede ayudarme?", armenian: "Օդորակիչը չի աշխատում։ Կարո՞ղ եք օգնել ինձ։" },
      { key: 'B', spanish: "La playa está cerrada.", armenian: "Լողափը փակ է։" },
      { key: 'C', spanish: "Quiero un café con leche.", armenian: "Կաթով սուրճ եմ ուզում։" },
      { key: 'D', spanish: "Tengo una maleta azul.", armenian: "Ես կապույտ ճամպրուկ ունեմ։" }
    ],
    correctAnswer: 'A',
    category: 'hotel',
    explanation: "Si el aire acondicionado (օդորակիչը) está averiado, comunicas: 'El aire acondicionado no funciona. ¿Puede ayudarme?'"
  },
  {
    id: 13,
    spanishQuestion: "Estás en una ciudad nueva y quieres una recomendación local. ¿Qué preguntas?",
    armenianQuestion: "Դու նոր քաղաքում ես և ուզում ես տեղացիների խորհուրդը։ Ի՞նչ ես հարցնում։",
    options: [
      { key: 'A', spanish: "¿Qué lugar me recomienda visitar aquí?", armenian: "Ի՞նչ վայր եք խորհուրդ տալիս այստեղ այցելել։" },
      { key: 'B', spanish: "¿Dónde está mi pasaporte dentro del avión?", armenian: "Որտե՞ղ է իմ անձնագիրը ինքնաթիռի մեջ։" },
      { key: 'C', spanish: "¿Cuánto cuesta mi nombre?", armenian: "Որքա՞ն արժե իմ անունը։" },
      { key: 'D', spanish: "¿Tiene una habitación en la sopa?", armenian: "Ապուրի մեջ սենյակ ունե՞ք։" }
    ],
    correctAnswer: 'A',
    category: 'shopping',
    explanation: "Para pedir recomendaciones locales, preguntas: '¿Qué lugar me recomienda visitar aquí?' (Ի՞նչ վայր եք խորհուրդ տալիս այստեղ այցելել):"
  },
  {
    id: 14,
    spanishQuestion: "Un taxi parece demasiado caro. ¿Qué pregunta es inteligente?",
    armenianQuestion: "Տաքսին չափազանց թանկ է թվում։ Ո՞ր հարցն է խելացի։",
    options: [
      { key: 'A', spanish: "¿Cuánto cuesta aproximadamente hasta el centro?", armenian: "Մոտավորապես որքան կարժենա մինչև կենտրոն։" },
      { key: 'B', spanish: "¿Tiene una talla más grande?", armenian: "Ավելի մեծ չափս ունե՞ք։" },
      { key: 'C', spanish: "¿Dónde está la carta?", armenian: "Որտե՞ղ է ճաշացանկը։" },
      { key: 'D', spanish: "¿Puedo pagar con sopa?", armenian: "Կարո՞ղ եմ ապուրով վճարել։" }
    ],
    correctAnswer: 'A',
    category: 'transport',
    explanation: "Es prudente preguntar la tarifa aproximada: '¿Cuánto cuesta aproximadamente hasta el centro?' (Մոտավորապես որքան կարժենա մինչև կենտրոն) antes de iniciar el viaje."
  },
  {
    id: 15,
    spanishQuestion: "En el restaurante, no entiendes el menú. ¿Qué frase es mejor?",
    armenianQuestion: "Ռեստորանում դու չես հասկանում ճաշացանկը։ Ո՞ր արտահայտությունն է ավելի լավ։",
    options: [
      { key: 'A', spanish: "¿Puede explicarme este plato, por favor?", armenian: "Կարո՞ղ եք բացատրել այս ուտեստը, խնդրում եմ։" },
      { key: 'B', spanish: "¿Dónde está mi vuelo?", armenian: "Որտե՞ղ է իմ չվերթը։" },
      { key: 'C', spanish: "¿Tiene otro pasaporte?", armenian: "Ուրիշ անձնագիր ունե՞ք։" },
      { key: 'D', spanish: "Quiero facturar mi maleta.", armenian: "Ուզում եմ հանձնել իմ ճամպրուկը։" }
    ],
    correctAnswer: 'A',
    category: 'restaurant',
    explanation: "Si el menú o plato (ուտեստ) no está claro, puedes pedir explicación: '¿Puede explicarme este plato, por favor?'"
  },
  {
    id: 16,
    spanishQuestion: "Estás en una tienda y quieres comprar un regalo típico de España. ¿Qué preguntas?",
    armenianQuestion: "Դու խանութում ես և ուզում ես գնել Իսպանիային բնորոշ նվեր։ Ի՞նչ ես հարցնում։",
    options: [
      { key: 'A', spanish: "¿Tiene algún regalo típico de España?", armenian: "Իսպանիային բնորոշ որևէ նվեր ունե՞ք։" },
      { key: 'B', spanish: "¿Dónde está el hospital?", armenian: "Որտե՞ղ է հիվանդանոցը։" },
      { key: 'C', spanish: "¿Puedo alquilar una sombrilla?", armenian: "Կարո՞ղ եմ արևանոց վարձել։" },
      { key: 'D', spanish: "¿A qué hora sale el tren?", armenian: "Ժամը քանիսի՞ն է մեկնում գնացքը։" }
    ],
    correctAnswer: 'A',
    category: 'shopping',
    explanation: "Para buscar souvenirs típicos, preguntas: '¿Tiene algún regalo típico de España?' (Իսպանիային բնորոշ որևէ նվեր ունե՞ք):"
  },
  {
    id: 17,
    spanishQuestion: "En el hotel, quieres salir más tarde de la habitación. ¿Qué preguntas?",
    armenianQuestion: "Հյուրանոցում դու ուզում ես սենյակից ավելի ուշ դուրս գալ։ Ի՞նչ ես հարցնում։",
    options: [
      { key: 'A', spanish: "¿Es posible hacer el check-out más tarde?", armenian: "Հնարավո՞ր է check-out-ը ավելի ուշ անել։" },
      { key: 'B', spanish: "¿Tiene comida vegetariana?", armenian: "Բուսակերական ուտելիք ունե՞ք։" },
      { key: 'C', spanish: "¿Dónde está la parada de autobús?", armenian: "Որտե՞ղ է ավտոբուսի կանգառը։" },
      { key: 'D', spanish: "¿Cuánto cuesta el helado?", armenian: "Որքա՞ն արժե պաղպաղակը։" }
    ],
    correctAnswer: 'A',
    category: 'hotel',
    explanation: "Para retrasar la salida del hotel se pregunta: '¿Es posible hacer el check-out más tarde?' (Հնարավո՞ր է check-out-ը ավելի ուշ անել):"
  },
  {
    id: 18,
    spanishQuestion: "Alguien te explica el camino, pero no entiendes todo. ¿Qué dices?",
    armenianQuestion: "Ինչ-որ մեկը քեզ ճանապարհն է բացատրում, բայց դու ամեն ինչ չես հասկանում։ Ի՞նչ ես ասում։",
    options: [
      { key: 'A', spanish: "¿Puede repetirlo, por favor?", armenian: "Կարո՞ղ եք կրկնել, խնդրում եմ։" },
      { key: 'B', spanish: "Quiero una sopa.", armenian: "Ապուր եմ ուզում։" },
      { key: 'C', spanish: "Tengo una reserva.", armenian: "Ես ամրագրում ունեմ։" },
      { key: 'D', spanish: "No se puede nadar.", armenian: "Չի կարելի լողալ։" }
    ],
    correctAnswer: 'A',
    category: 'transport',
    explanation: "Si necesitas que se repita la explicación de las indicaciones, dices: '¿Puede repetirlo, por favor?' (Կարո՞ղ եք կրկնել, խնդրում եմ):"
  }
];
